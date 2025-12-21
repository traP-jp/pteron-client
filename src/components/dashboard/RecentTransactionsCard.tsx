import { use } from "react";

import { ActionIcon, Card, Group, Loader, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

import type { Transaction } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { TransactionList } from "/@/components/TransactionList";

interface RecentTransactionsData {
    transactions: Transaction[];
}

interface RecentTransactionsCardProps {
    fetcher: Promise<RecentTransactionsData>;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export const RecentTransactionsCard = ({
    fetcher,
    onRefresh,
    isRefreshing = false,
}: RecentTransactionsCardProps) => {
    const { transactions } = use(fetcher);

    return (
        <Card
            padding="lg"
            radius="md"
            withBorder
            h="100%"
            style={{ display: "flex", flexDirection: "column" }}
        >
            <Group
                justify="space-between"
                mb="md"
            >
                <Text
                    size="lg"
                    fw={600}
                >
                    最近の取引
                </Text>
                {onRefresh && (
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        aria-label="更新"
                    >
                        {isRefreshing ? <Loader size={18} /> : <IconRefresh size={18} />}
                    </ActionIcon>
                )}
            </Group>

            <ErrorBoundary>
                <Stack
                    gap="md"
                    style={{ flex: 1, minHeight: 0, maxHeight: 300, overflow: "auto" }}
                >
                    <TransactionList
                        transactions={transactions}
                        direction="both"
                    />
                </Stack>
            </ErrorBoundary>
        </Card>
    );
};
