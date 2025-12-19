import { Button, Modal, type ModalProps, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import apis from "/@/api";

export type CreateProjectModalProps = Omit<ModalProps, "title">;

// Zod スキーマ定義
const projectFormSchema = z.object({
    name: z
        .string()
        .min(1, "プロジェクト名は必須項目です")
        .regex(/^[A-Za-z0-9_-]+$/, "プロジェクト名には英数字と '_'、'-' のみ使用できます"),
    url: z
        .string()
        .max(2048, "URLは2048文字以内で入力してください")
        .superRefine((val, ctx) => {
            if (val.length === 0) return; // 空は許可

            let parsed: URL;
            try {
                parsed = new URL(val);
            } catch {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "有効なURL形式で入力してください",
                });
                return;
            }

            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "URLは http:// または https:// で始まる必要があります",
                });
                return;
            }

            const hostname = parsed.hostname;
            if (hostname === "localhost" || hostname === "127.0.0.1") {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "localhost は使用できません",
                });
                return;
            }

            if (!hostname || hostname.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "有効なホスト名を入力してください",
                });
                return;
            }

            const labels = hostname.split(".");
            if (labels.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "有効なドメイン名を入力してください（例: example.com）",
                });
                return;
            }

            for (const label of labels) {
                if (label.length === 0 || label.length > 63) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "ドメイン名の各部分は1〜63文字で入力してください",
                    });
                    return;
                }
                if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label) && label.length > 1) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "ドメイン名には英数字とハイフンのみ使用できます",
                    });
                    return;
                }
                if (label.length === 1 && !/^[a-zA-Z0-9]$/.test(label)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "ドメイン名には英数字とハイフンのみ使用できます",
                    });
                    return;
                }
            }

            const tld = labels[labels.length - 1]!;
            if (/^\d+$/.test(tld)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "有効なトップレベルドメインを入力してください",
                });
                return;
            }
        }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

async function createProject(values: ProjectFormValues) {
    return apis.internal.projects.createProject({
        name: values.name,
        url: values.url || undefined,
    });
}

function CreateProjectModalContents({ onClose }: Pick<CreateProjectModalProps, "onClose">) {
    const form = useForm<ProjectFormValues>({
        mode: "controlled",
        initialValues: {
            name: "",
            url: "",
        },
        validate: zodResolver(projectFormSchema),
        validateInputOnBlur: true,
    });

    const handleSubmit = form.onSubmit(async values => {
        await createProject(values);
        onClose?.();
    });

    return (
        <form onSubmit={handleSubmit}>
            <TextInput
                label="プロジェクト名"
                description="プロジェクト名は後から変更することはできません"
                required
                {...form.getInputProps("name")}
            />
            <TextInput
                label="プロジェクトURL"
                description="プロジェクトURLは後から変更することができます"
                mt="md"
                {...form.getInputProps("url")}
            />
            <div className="flex justify-end mt-4">
                <Button
                    type="submit"
                    disabled={!form.values.name || !form.isValid()}
                >
                    作成
                </Button>
            </div>
        </form>
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
