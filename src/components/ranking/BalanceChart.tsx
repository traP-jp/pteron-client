import { AreaChart, type AreaChartProps } from "@mantine/charts";

import { type Transaction } from "/@/api/schema/internal";

export interface BalanceChartProps extends Omit<AreaChartProps, "dataKey" | "data" | "series"> {
    transactions: Transaction[];
}

interface ChartRecord {
    date: string;
    sum: number;
}

type ChartData = ChartRecord[];

const formatTransactionData = (start: number, transactions: Transaction[]): ChartData => {
    let sum = start;

    const data: ChartData = [];

    let prevDate = new Date(transactions[0]!.created_at);

    transactions.forEach(({ amount, created_at }: Transaction) => {
        const date = new Date(created_at);
        if (prevDate.toDateString() != date.toDateString()) {
            data.push({
                sum,
                date: date.toLocaleDateString(),
            });
        }

        sum += amount;
        prevDate = date;
    });

    data.push({
        sum,
        date: new Date().toLocaleDateString(),
    });

    return data;
};

const BalanceChart = ({
    transactions,
    tickLine = "xy",
    curveType = "linear",
    ...props
}: BalanceChartProps) => {
    return (
        <AreaChart
            data={formatTransactionData(0, transactions)}
            dataKey="date"
            series={[{ name: "sum", color: "blue.6" }]}
            tickLine={tickLine}
            curveType={curveType}
            {...props}
        />
    );
};

export default BalanceChart;
