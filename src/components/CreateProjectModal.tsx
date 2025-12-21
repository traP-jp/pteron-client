import { useState } from "react";

import { Button, Modal, type ModalProps, TextInput } from "@mantine/core";

import apis from "/@/api";
import type { Project } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { normalizeUrl, validateUrl } from "/@/lib/validation";

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
    const [nameError, setNameError] = useState("");
    const [urlError, setUrlError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNameChange = (newName: string) => {
        setName(newName);
        setNameError(validateProjectName(newName));
    };

    const handleUrlChange = (newUrl: string) => {
        setUrl(newUrl);
        setUrlError(validateUrl(newUrl));
    };

    const handleCreate = async () => {
        // 再度バリデーションを実行
        const nameValidationError = validateProjectName(name);
        const urlValidationError = validateUrl(url);

        if (nameValidationError) {
            setNameError(nameValidationError);
            return;
        }

        if (urlValidationError) {
            setUrlError(urlValidationError);
            return;
        }

        setIsSubmitting(true);

        try {
            const normalizedUrl = normalizeUrl(url);

            const { data } = await apis.internal.projects.createProject({
                name,
                url: normalizedUrl || undefined,
            });

            onSuccess?.(data);
            onClose?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSubmitDisabled = !name || !!nameError || !!urlError || isSubmitting;

    return (
        <>
            <TextInput
                label="プロジェクト名"
                description="プロジェクト名は後から変更することはできません"
                required
                value={name}
                error={nameError}
                onChange={e => handleNameChange(e.currentTarget.value)}
            />
            <TextInput
                label="プロジェクトURL"
                description="プロジェクトURLは後から変更することができます"
                placeholder="https://example.com"
                value={url}
                error={urlError}
                onChange={e => handleUrlChange(e.currentTarget.value)}
            />
            <div className="flex justify-end mt-4">
                <Button
                    disabled={isSubmitDisabled}
                    loading={isSubmitting}
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
