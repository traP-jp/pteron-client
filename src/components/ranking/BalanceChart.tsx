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
    date: string | number;
    sum: number;
    label?: string; // ツールチップ用などのフォーマット済みラベル
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
): { data: ChartData; isHourly: boolean } => {
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
            date: key,
            label: d.toLocaleDateString(),
        });
    }
    return { data, isHourly: false };
};

/** 時間単位でデータを作成（正確な時刻を使用、Ticks生成付き） */
const formatHourlyData = (
    start: number,
    transactions: Transaction[],
    viewType: "user" | "project"
): { data: ChartData; isHourly: boolean; ticks: number[] } => {
    // 取引を時系列順にソート
    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Ticks生成 (毎正時)
    const timeStamps = sortedTransactions.map(t => new Date(t.createdAt).getTime());
    const minTime = Math.min(...timeStamps);
    const maxTime = Math.max(...timeStamps);

    const ticks: number[] = [];
    const t = new Date(minTime);
    t.setMinutes(0, 0, 0); // 最初の時間の00分

    // 最後の取引時刻を超えるまでループ
    while (t.getTime() <= maxTime) {
        ticks.push(t.getTime());
        t.setHours(t.getHours() + 1);
    }
    // 最後の取引より後の正時も一つ追加（グラフの右端用）
    const nextHour = new Date(t);
    ticks.push(nextHour.getTime());

    const data: ChartData = [];
    let running = start;

    // 開始点（Ticksの最初）
    const startTimeIndex = ticks[0]!;
    data.push({
        sum: running,
        date: startTimeIndex,
        label: new Date(startTimeIndex).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
    });

    // 各取引ごとにデータポイントを追加（正確な時刻）
    for (const { amount, createdAt, type } of sortedTransactions) {
        const delta = getTransactionDelta(amount, type, viewType);
        running += delta;
        const d = new Date(createdAt);
        data.push({
            sum: running,
            date: d.getTime(),
            label: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
    }

    // Ticksの最後（最新の正時）まで伸ばす
    const lastTime = ticks[ticks.length - 1]!;
    data.push({
        sum: running,
        date: lastTime,
        label: new Date(lastTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    return { data, isHourly: true, ticks };
};

const formatTransactionData = (
    start: number,
    transactions: Transaction[],
    viewType: "user" | "project"
): { data: ChartData; isHourly: boolean; ticks?: number[] } => {
    if (!transactions || transactions.length === 0) return { data: [], isHourly: false };

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

    const { data, isHourly, ticks } = formatTransactionData(0, transactions, viewType);

    // 時間単位の場合はX軸を数値（タイムスタンプ）として扱い、フォーマッターで時刻表示にする
    const xAxisProps = isHourly
        ? {
              type: "number" as const,
              domain:
                  ticks && ticks.length > 0
                      ? [ticks[0]!, ticks[ticks.length - 1]!]
                      : ["auto", "auto"], // Ticksの範囲に合わせる
              tickFormatter: (value: number) =>
                  new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              ticks: ticks,
              interval: 0, // 全Ticksを表示
          }
        : {
              tickFormatter: (value: string) => {
                  // YYYY-MM-DD -> MM/DD に短縮して表示
                  try {
                      const d = new Date(value);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                  } catch {
                      return value;
                  }
              },
          };

    return (
        <ErrorBoundary>
            <AreaChart
                data={data}
                dataKey="date"
                series={[{ name: "sum", color: "blue.6" }]}
                tickLine={tickLine}
                curveType={isHourly ? "stepAfter" : curveType} // 時間単位なら階段状（変化の瞬間まで値が維持される）が正確だが、好みに応じてlinearでも
                xAxisProps={xAxisProps}
                {...props}
            />
        </ErrorBoundary>
    );
};

export default BalanceChart;
