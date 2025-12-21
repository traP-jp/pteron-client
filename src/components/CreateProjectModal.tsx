import { useState } from "react";

import { Button, Modal, type ModalProps, TextInput } from "@mantine/core";

import apis from "/@/api";
import type { Project } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";

export type CreateProjectModalProps = Omit<ModalProps, "title"> & {
    onSuccess?: (project: Project) => void;
};

const validateProjectName = (name: string): string => {
    if (name.length === 0) return "プロジェクト名は必須項目です";
    if (!/^[A-Za-z0-9_]+$/.test(name)) {
        return "プロジェクト名には英数字と '_' のみ使用できます";
    }
    return "";
};

function CreateProjectModalContents({
    onClose,
    onSuccess,
}: Pick<CreateProjectModalProps, "onClose" | "onSuccess">) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleNameChange = (newName: string) => {
        setName(newName);
        setErrorMessage(validateProjectName(newName));
    };

    const handleCreate = async () => {
        if (name.length === 0) return;

        const { data } = await apis.internal.projects.createProject({
            name,
            url: url || undefined,
        });

        onSuccess?.(data);
        onClose?.();
    };

    const isSubmitDisabled = !name || !!errorMessage;

    return (
        <>
            <TextInput
                label="プロジェクト名"
                description="プロジェクト名は後から変更することはできません"
                required
                value={name}
                error={errorMessage}
                onChange={e => handleNameChange(e.currentTarget.value)}
            />
            <TextInput
                label="プロジェクトURL"
                description="プロジェクトURLは後から変更することができます"
                value={url}
                onChange={e => setUrl(e.currentTarget.value)}
            />
            <div className="flex justify-end mt-4">
                <Button
                    disabled={isSubmitDisabled}
                    onClick={handleCreate}
                >
                    作成
                </Button>
            </div>
        </>
    );
}

export function CreateProjectModal({ onSuccess, ...props }: CreateProjectModalProps) {
    return (
        <Modal
            {...props}
            title="新規プロジェクト"
        >
            <ErrorBoundary>
                <CreateProjectModalContents
                    onClose={props.onClose}
                    onSuccess={onSuccess}
                />
            </ErrorBoundary>
        </Modal>
    );
}
