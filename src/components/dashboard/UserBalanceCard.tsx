import { Card, Group, Stack, Text } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";

import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { type Copia, toBranded } from "/@/types/entity";

interface UserBalanceCardProps {
    balance: number;
    recentChange: number;
}

export const UserBalanceCard = ({ balance, recentChange }: UserBalanceCardProps) => {
    return (
        <Card
            padding="md"
            radius="md"
            withBorder
            style={{ borderColor: "var(--mantine-color-violet-light)" }}
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
                        <IconWallet
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
                            c={recentChange >= 0 ? "green" : "red"}
                        >
                            {recentChange >= 0 ? "+" : ""}
                            {recentChange.toLocaleString()}
                        </Text>
                        <Text
                            size="xs"
                            c="dimmed"
                        >
                            直近10件
                        </Text>
                    </Group>
                </Stack>
            </ErrorBoundary>
        </Card>
    );
};
