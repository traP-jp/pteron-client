import { use } from "react";

import { Card, Group, Stack, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { type Copia, toBranded } from "/@/types/entity";

interface UserBalanceData {
    balance: number;
    recentChange: number;
}

interface UserBalanceCardProps {
    fetcher: Promise<UserBalanceData>;
}

export const UserBalanceCard = ({ fetcher }: UserBalanceCardProps) => {
    const { balance, recentChange } = use(fetcher);
    return (
        <Card
            padding="md"
            radius="md"
            style={{
                backgroundColor:
                    "light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))",
            }}
            withBorder={false}
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
                            あなたの残高
                        </Text>
                        <IconUser
                            size={20}
                            style={{ color: "var(--mantine-color-violet-6)" }}
                        />
                    </Group>
                    <PAmount
                        value={toBranded<Copia>(BigInt(balance))}
                        leadingIcon
                        compact
                        size="lg"
                        fw={700}
                    />
                    <Group
                        gap="xs"
                        mt="xs"
                    >
                        <Text
                            size="xs"
                            c={recentChange > 0 ? "green" : recentChange < 0 ? "red" : "dimmed"}
                            fw={500}
                        >
                            {recentChange > 0 ? "+" : ""}
                            {recentChange.toLocaleString()}
                        </Text>
                        <Text
                            size="xs"
                            c="dimmed"
                        >
                            直近10件の変動
                        </Text>
                    </Group>
                </Stack>
            </ErrorBoundary>
        </Card>
    );
};
