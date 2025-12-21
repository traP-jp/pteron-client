import { use } from "react";

import { Card, Group, Stack, Text } from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";

import ErrorBoundary from "/@/components/ErrorBoundary";

interface SystemCountData {
    count?: number;
}

interface SystemCountCardProps {
    fetcher: Promise<SystemCountData>;
}

export const SystemCountCard = ({ fetcher }: SystemCountCardProps) => {
    const { count } = use(fetcher);
    const isAvailable = count !== undefined;

    return (
        <Card
            padding="md"
            radius="md"
            withBorder
        >
            <ErrorBoundary>
                <Stack gap="md">
                    <Group
                        justify="space-between"
                        align="flex-start"
                    >
                        <Text
                            size="lg"
                            fw={600}
                        >
                            取引件数
                        </Text>
                        <IconReceipt
                            size={20}
                            style={{ color: "var(--mantine-color-orange-6)" }}
                        />
                    </Group>
                    {isAvailable ? (
                        <Text
                            size="lg"
                            fw={700}
                        >
                            {count.toLocaleString()} 件
                        </Text>
                    ) : (
                        <Text
                            size="lg"
                            fw={700}
                            c="dimmed"
                        >
                            -
                        </Text>
                    )}
                    <Text
                        size="xs"
                        c="dimmed"
                        mt="xs"
                    >
                        {isAvailable ? "過去7日" : "統計データは準備中です"}
                    </Text>
                </Stack>
            </ErrorBoundary>
        </Card>
    );
};
