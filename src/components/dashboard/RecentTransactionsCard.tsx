import { Card, Stack, Text } from "@mantine/core";

import type { Transaction } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { TransactionList } from "/@/components/TransactionList";

interface RecentTransactionsCardProps {
    transactions: Transaction[];
}

export const RecentTransactionsCard = ({ transactions }: RecentTransactionsCardProps) => {
    return (
        <Card
            padding="lg"
            radius="md"
            withBorder
            style={{ display: "flex", flexDirection: "column" }}
        >
            <ErrorBoundary>
                <Stack gap="md">
                    <Text
                        size="lg"
                        fw={600}
                    >
                        最近の取引
                    </Text>
                    <div className="h-80 overflow-auto">
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
