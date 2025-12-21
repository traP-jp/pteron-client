import { use } from "react";

import { Card, Group, Stack, Text } from "@mantine/core";
import { IconBuildingBank } from "@tabler/icons-react";

import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { type Copia, toBranded } from "/@/types/entity";

interface SystemBalanceData {
    balance?: number;
    difference?: number;
}

interface SystemBalanceCardProps {
    fetcher: Promise<SystemBalanceData>;
}

export const SystemBalanceCard = ({ fetcher }: SystemBalanceCardProps) => {
    const { balance, difference } = use(fetcher);
    const isAvailable = balance !== undefined && difference !== undefined;

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
                            流通総額
                        </Text>
                        <IconBuildingBank
                            size={20}
                            style={{ color: "var(--mantine-color-blue-6)" }}
                        />
                    </Group>
                    {isAvailable ? (
                        <PAmount
                            value={toBranded<Copia>(BigInt(balance))}
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
                    <Group
                        gap="xs"
                        mt="xs"
                    >
                        {isAvailable ? (
                            <>
                                <Text
                                    size="xs"
                                    c={difference >= 0 ? "green" : "red"}
                                >
                                    {difference >= 0 ? "+" : ""}
                                    {difference.toLocaleString()}
                                </Text>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    過去7日
                                </Text>
                            </>
                        ) : (
                            <Text
                                size="xs"
                                c="dimmed"
                            >
                                統計データは準備中です
                            </Text>
                        )}
                    </Group>
                </Stack>
            </ErrorBoundary>
        </Card>
    );
};
