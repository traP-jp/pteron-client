import { ActionIcon, Card, Group, Loader, Stack, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

import type { Transaction } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { TransactionList } from "/@/components/TransactionList";

interface RecentTransactionsCardProps {
    transactions: Transaction[];
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export const RecentTransactionsCard = ({
    transactions,
    onRefresh,
    isRefreshing = false,
}: RecentTransactionsCardProps) => {
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
                    style={{ flex: 1, minHeight: 0 }}
                >
                    <div className="flex-1 overflow-auto min-h-0">
                        <TransactionList
                            transactions={transactions}
                            direction="both"
                        />
                    </div>
                </Stack>
            </ErrorBoundary>
        </Card>
    );
};
