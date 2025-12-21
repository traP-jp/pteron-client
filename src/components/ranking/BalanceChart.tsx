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

/** 取引金額の符号を計算 */
const getTransactionDelta = (
    amount: number,
    type: string,
    viewType: "user" | "project"
): number => {
    if (viewType === "project") {
        // プロジェクト視点: BILL_PAYMENTとSYSTEMは収入、TRANSFERは支出
        return type === "TRANSFER" ? -amount : amount;
    } else {
        // ユーザー視点: BILL_PAYMENTは支出、それ以外は収入
        return type === "BILL_PAYMENT" ? -amount : amount;
    }
};

/** 日単位でデータを集約 */
const formatDailyData = (
    start: number,
    transactions: Transaction[],
    viewType: "user" | "project"
): ChartData => {
    const toLocalDateKey = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const dayDelta = new Map<string, number>();
    for (const { amount, createdAt, type } of transactions) {
        const d = new Date(createdAt);
        const key = toLocalDateKey(d);
        const delta = getTransactionDelta(amount, type, viewType);
        dayDelta.set(key, (dayDelta.get(key) ?? 0) + delta);
    }

    const startDate = new Date(transactions[0]!.createdAt);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    const data: ChartData = [];
    let running = start;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const key = toLocalDateKey(d);
        const delta = dayDelta.get(key) ?? 0;
        running += delta;
        data.push({
            sum: running,
            date: d.toLocaleDateString(),
        });
    }
    return data;
};

/** 時間単位でデータを集約（データが少ない場合用） */
const formatHourlyData = (
    start: number,
    transactions: Transaction[],
    viewType: "user" | "project"
): ChartData => {
    // 1時間単位のキーを取得するヘルパー (例: "14:00")
    const toHourKey = (date: Date): string => {
        const hour = String(date.getHours()).padStart(2, "0");
        return `${hour}:00`;
    };

    // 時間ごとにデルタを集約
    const hourDelta = new Map<string, number>();
    for (const { amount, createdAt, type } of transactions) {
        const d = new Date(createdAt);
        const key = toHourKey(d);
        const delta = getTransactionDelta(amount, type, viewType);
        hourDelta.set(key, (hourDelta.get(key) ?? 0) + delta);
    }

    // 取引の時間範囲を取得
    const dates = transactions.map(t => new Date(t.createdAt));
    const minHour = Math.min(...dates.map(d => d.getHours()));
    const maxHour = Math.max(...dates.map(d => d.getHours()));

    const data: ChartData = [];
    let running = start;

    // 最初の時間から最後の時間まで1時間ごとにデータポイントを作成
    for (let h = minHour; h <= maxHour; h++) {
        const key = `${String(h).padStart(2, "0")}:00`;
        const delta = hourDelta.get(key) ?? 0;
        running += delta;
        data.push({
            sum: running,
            date: key,
        });
    }

    // 現在時刻の次の時間まで表示（最新の状態を見せる）
    const nowHour = new Date().getHours();
    if (nowHour > maxHour) {
        data.push({
            sum: running,
            date: `${String(nowHour).padStart(2, "0")}:00`,
        });
    }

    return data;
};

const formatTransactionData = (
    start: number,
    transactions: Transaction[],
    viewType: "user" | "project"
): ChartData => {
    if (!transactions || transactions.length === 0) return [];

    // 日数範囲を計算
    const dates = transactions.map(t => new Date(t.createdAt));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    // 日数差を計算（ミリ秒 → 日）
    const daysDiff = Math.floor((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    // 2日以内なら時間単位、それ以上なら日単位
    if (daysDiff <= 1) {
        return formatHourlyData(start, transactions, viewType);
    } else {
        return formatDailyData(start, transactions, viewType);
    }
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
