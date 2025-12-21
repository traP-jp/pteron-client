import { Card, Group, Stack, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { TrendIndicator } from "/@/components/TrendIndicator";
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
            bg="gray.1"
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
                        <TrendIndicator
                            diff={recentChange}
                            size="xs"
                        />
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
