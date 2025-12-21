import { AreaChart, type AreaChartProps } from "@mantine/charts";
import { Center, Text } from "@mantine/core";

import { type Transaction } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";

export interface BalanceChartProps extends Omit<AreaChartProps, "dataKey" | "data" | "series"> {
    transactions: Transaction[];
    /** チャートの視点: "user" = ユーザー視点, "project" = プロジェクト視点 */
    viewType?: "user" | "project";
}

interface ChartRecord {
    date: string;
    sum: number;
}

type ChartData = ChartRecord[];

const formatTransactionData = (
    start: number,
    transactions: Transaction[],
    viewType: "user" | "project"
): ChartData => {
    if (!transactions || transactions.length === 0) return [];

    // ローカル日付文字列を取得するヘルパー (YYYY-MM-DD形式)
    const toLocalDateKey = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const dayDelta = new Map<string, number>();
    for (const { amount, createdAt, type } of transactions) {
        const d = new Date(createdAt);
        const key = toLocalDateKey(d); // ローカル日付を使用

        // 視点によって符号を変える
        // ユーザー視点: BILL_PAYMENT は支払い（マイナス）、それ以外はプラス
        // プロジェクト視点: BILL_PAYMENT は収入（プラス）、TRANSFER は支出（マイナス）
        let delta: number;
        if (viewType === "project") {
            // プロジェクト視点: BILL_PAYMENTとSYSTEMは収入、TRANSFERは支出
            delta = type === "TRANSFER" ? -amount : amount;
        } else {
            // ユーザー視点: BILL_PAYMENTは支出、それ以外は収入
            delta = type === "BILL_PAYMENT" ? -amount : amount;
        }
        dayDelta.set(key, (dayDelta.get(key) ?? 0) + delta);
    }
    const startDate = new Date(transactions[0]!.createdAt);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    const data: ChartData = [];
    let running = start;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const key = toLocalDateKey(d); // ローカル日付を使用
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
    viewType = "user",
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
                data={formatTransactionData(0, transactions, viewType)}
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
