import { use } from "react";

import { Card, Group, Stack, Text } from "@mantine/core";
import { IconCoins } from "@tabler/icons-react";

import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { type Copia, toBranded } from "/@/types/entity";

interface SystemTotalData {
    total?: number;
}

interface SystemTotalCardProps {
    fetcher: Promise<SystemTotalData>;
}

export const SystemTotalCard = ({ fetcher }: SystemTotalCardProps) => {
    const { total } = use(fetcher);
    const isAvailable = total !== undefined;

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
                            総取引額
                        </Text>
                        <IconCoins
                            size={20}
                            style={{ color: "var(--mantine-color-green-6)" }}
                        />
                    </Group>
                    {isAvailable ? (
                        <PAmount
                            value={toBranded<Copia>(BigInt(total))}
                            leadingIcon
                            compact
                            size="lg"
                            fw={700}
                        />
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
