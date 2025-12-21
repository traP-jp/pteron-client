import { AreaChart, type AreaChartProps } from "@mantine/charts";
import { Center, Text } from "@mantine/core";

import { type Transaction } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";

export interface BalanceChartProps extends Omit<AreaChartProps, "dataKey" | "data" | "series"> {
    transactions: Transaction[];
}

interface ChartRecord {
    date: string;
    sum: number;
}

type ChartData = ChartRecord[];

const formatTransactionData = (start: number, transactions: Transaction[]): ChartData => {
    if (!transactions || transactions.length === 0) return [];

    const dayDelta = new Map<string, number>();
    for (const { amount, createdAt, type } of transactions) {
        const d = new Date(createdAt);
        const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
        const delta = type === "BILL_PAYMENT" ? -amount : amount;
        dayDelta.set(key, (dayDelta.get(key) ?? 0) + delta);
    }
    const startDate = new Date(transactions[0]!.createdAt);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    const data: ChartData = [];
    let running = start;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        const delta = dayDelta.get(key) ?? 0;
        running += delta;
        data.push({
            sum: running,
            date: d.toLocaleDateString(),
        });
    }
    return data;
};

const BalanceChart = ({
    transactions,
    tickLine = "xy",
    curveType = "linear",
    ...props
}: BalanceChartProps) => {
    if (!transactions || transactions.length === 0) {
        return (
            <Center h={props.h || 200}>
                <Text c="dimmed">データがありません</Text>
            </Center>
        );
    }

    return (
        <ErrorBoundary>
            <AreaChart
                data={formatTransactionData(0, transactions)}
                dataKey="date"
                series={[{ name: "sum", color: "blue.6" }]}
                tickLine={tickLine}
                curveType={curveType}
                {...props}
            />
        </ErrorBoundary>
    );
};

export default BalanceChart;
