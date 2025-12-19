import { useState } from "react";

import { Button, Modal, type ModalProps, TextInput } from "@mantine/core";

import { api } from "../api/api";

export type CreateProjectModalProps = Omit<ModalProps, "title">;

function projectNameValidator(name: string): string {
    if (name.length === 0) return "プロジェクト名は必須項目です";
    const regex = /^[A-Za-z0-9_-]+$/;
    if (!regex.test(name)) return "プロジェクト名には英数字と '_'、'-' のみ使用できます";
    return "";
}

async function createProject(name: string, url: string) {
    if (name.length === 0) return;
    return api.internal.client.POST("/projects", {
        body: {
            name,
            url: url || undefined,
        },
    });
}

function CreateProjectModalContents({ onClose }: Pick<CreateProjectModalProps, "onClose">) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    return (
        <>
            <TextInput
                label="プロジェクト名"
                description="プロジェクト名は後から変更することはできません"
                required
                value={name}
                error={errorMessage}
                onChange={event => {
                    const newName = event.currentTarget.value;
                    setName(newName);
                    setErrorMessage(projectNameValidator(newName));
                }}
            />
            <TextInput
                label="プロジェクトURL"
                description="プロジェクトURLは後から変更することができます"
                value={url}
                onChange={event => setUrl(event.currentTarget.value)}
            />
            <div className="flex justify-end mt-4">
                <Button
                    disabled={!name || !!errorMessage}
                    onClick={() => createProject(name, url).then(onClose)}
                >
                    作成
                </Button>
            </div>
        </>
    );
}

export function CreateProjectModal(props: CreateProjectModalProps) {
    return (
        <Modal
            {...props}
            title="新規プロジェクト"
        >
            <CreateProjectModalContents onClose={props.onClose} />
        </Modal>
    );
}
