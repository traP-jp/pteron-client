import { ActionIcon, CopyButton, Flex, Title, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { isAxiosError } from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authErrorHandler = async (error: any) => {
    const status = error.response?.status;

    if (status === 401) {
        showNotification({
            title: "ログインエラーが発生しました",
            message: "ログインしてください",
            color: "yellow",
        });
    }

    throw new Error(error);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const axiosErrorHandler = async (error: any) => {
    if (isAxiosError(error) && error.response?.data?.message) {
        showNotification({
            title: "エラーが発生しました",
            message: (
                <>
                    <Title order={5}>
                        {error.response.data.message || "予期せぬエラーが発生しました"}:
                        <pre className="inline">{error.response.config.url}</pre>
                    </Title>

                    <Flex
                        direction="row"
                        align="center"
                    >
                        <CopyButton
                            value={JSON.stringify(
                                {
                                    ...error,
                                    request_data: error.request?.data,
                                    response_data: error.response?.data,
                                },
                                undefined,
                                4
                            )}
                            timeout={2000}
                        >
                            {({ copied, copy }) => (
                                <Tooltip
                                    label={copied ? "Copied" : "Copy"}
                                    withArrow
                                    position="right"
                                >
                                    <ActionIcon
                                        color={copied ? "teal" : "gray"}
                                        variant="subtle"
                                        onClick={copy}
                                    >
                                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                        <pre className="inline text-ellipsis">
                            {JSON.stringify(error.response, undefined)}
                        </pre>
                    </Flex>
                </>
            ),
            color: "red",
        });
    } else {
        showNotification({
            title: "エラーが発生しました",
            message:
                typeof error?.message === "string" ? error.message : "予期せぬエラーが発生しました",
            color: "red",
        });
    }

    throw new Error(error);
};
