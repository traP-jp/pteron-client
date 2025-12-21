import { type MantineSize, Text, type TextProps, Tooltip } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";

import CopiaIcon from "/@/assets/icons/copiaNarrow.svg?react";
import styles from "/@/styles/p-amount.module.scss";
import type { Copia } from "/@/types/entity";

export type PAmountSize = MantineSize | "custom" | undefined;

/**
 * 大きな数値を省略表記に変換する
 * 例: 1234567 -> "1.23M", 1234 -> "1.23K"
 */
const formatCompact = (value: bigint): string => {
    const absValue = value < 0n ? -value : value;
    const sign = value < 0n ? "-" : "";

    // 数値を整形するヘルパー（末尾の0と不要な小数点を削除）
    const formatNumber = (num: number, decimals: number): string => {
        if (num >= 100) return Math.round(num).toString();
        return num.toFixed(decimals).replace(/\.?0+$/, "");
    };

    // B (Billion = 10億)
    if (absValue >= 1_000_000_000n) {
        const billions = Number(absValue) / 1_000_000_000;
        return `${sign}${formatNumber(billions, billions >= 10 ? 1 : 2)}B`;
    }
    // M (Million = 100万)
    if (absValue >= 1_000_000n) {
        const millions = Number(absValue) / 1_000_000;
        return `${sign}${formatNumber(millions, millions >= 10 ? 1 : 2)}M`;
    }
    // K (Thousand = 千)
    if (absValue >= 1_000n) {
        const thousands = Number(absValue) / 1_000;
        return `${sign}${formatNumber(thousands, thousands >= 10 ? 1 : 2)}K`;
    }
    return value.toString();
};

/**
 * キリの良い数値のみを省略表記に変換する安全なcompactモード
 * 整数または小数点1桁で表現できる場合のみ省略（例: 1M, 1.5M）
 * そうでない場合はフル表示（例: 1,234,567）
 */
const formatCompactSafe = (
    value: bigint,
    locales?: Intl.LocalesArgument,
    formatOptions?: BigIntToLocaleStringOptions
): { formatted: string; isCompacted: boolean } => {
    const absValue = value < 0n ? -value : value;
    const sign = value < 0n ? "-" : "";

    // 各閾値でチェック (B, M, K)
    const thresholds: Array<{ divisor: bigint; suffix: string }> = [
        { divisor: 1_000_000_000n, suffix: "B" },
        { divisor: 1_000_000n, suffix: "M" },
        { divisor: 1_000n, suffix: "K" },
    ];

    for (const { divisor, suffix } of thresholds) {
        if (absValue >= divisor) {
            // 整数で割り切れる場合
            if (absValue % divisor === 0n) {
                return {
                    formatted: `${sign}${absValue / divisor}${suffix}`,
                    isCompacted: true,
                };
            }
            // 小数点1桁で割り切れる場合 (例: 1.5M = 1,500,000)
            if ((absValue * 10n) % divisor === 0n) {
                const decimal = Number((absValue * 10n) / divisor) / 10;
                return {
                    formatted: `${sign}${decimal}${suffix}`,
                    isCompacted: true,
                };
            }
            // 割り切れない場合はフル表示
            return {
                formatted: value.toLocaleString(locales, formatOptions),
                isCompacted: false,
            };
        }
    }

    // 1000未満はそのまま表示
    return {
        formatted: value.toLocaleString(locales, formatOptions),
        isCompacted: false,
    };
};

export type PAmountProps<Size extends PAmountSize> = TextProps & {
    size?: Size;
    leadingIcon?: boolean;
    trailingDash?: boolean;
    coloring?: boolean;
    formatOptions?: BigIntToLocaleStringOptions;
    locales?: Intl.LocalesArgument;
    value: Copia;
    /**
     * 大きな数値を省略表示する
     * - true: 通常のcompact（K, M, Bなど、有効数字3桁程度）
     * - "safe": 安全なcompact（整数または小数1桁で割り切れる場合のみ省略）
     */
    compact?: boolean | "safe";
} & (Size extends "custom"
        ? {
              customSize: number;
          }
        : object);

const isCustomSize = (props: PAmountProps<PAmountSize>): props is PAmountProps<"custom"> => {
    return props.size === "custom";
};

export const PAmount = <Size extends PAmountSize = undefined>(_props: PAmountProps<Size>) => {
    const {
        fw = 500,
        leadingIcon = false,
        trailingDash = false,
        coloring = false,
        compact = "safe",
        formatOptions,
        size,
        locales,
        value,
        // customSize を明示的に抽出して spread に含まれないようにする
        // @ts-expect-error - customSize は Size が "custom" の場合のみ存在
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        customSize: _customSize,
        ...props
    } = _props;

    const customSize = isCustomSize(_props) ? _props.customSize : null;
    const color = value > 0 ? "green" : value < 0 ? "red" : "black";

    // 省略表示かどうかで表示形式を切り替え
    const getDisplayValue = (): { displayValue: string; isCompacted: boolean } => {
        if (compact === "safe") {
            const result = formatCompactSafe(value, locales, formatOptions);
            return { displayValue: result.formatted, isCompacted: result.isCompacted };
        }
        if (compact === true) {
            return {
                displayValue: formatCompact(value),
                isCompacted: value >= 1000n || value <= -1000n,
            };
        }
        return {
            displayValue: value.toLocaleString(locales, formatOptions),
            isCompacted: false,
        };
    };
    const { displayValue, isCompacted } = getDisplayValue();

    const content = (
        <Text
            className="p-amount flex flex-raw items-center"
            data-custom-size={customSize}
            c={coloring ? color : undefined}
            fw={fw}
            size={size}
            {...props}
        >
            {leadingIcon ? (
                <CopiaIcon
                    className={styles.copiaIcon}
                    data-custom-size={customSize}
                />
            ) : (
                <></>
            )}
            <span className="value">{displayValue}</span>
            {trailingDash ? <IconMinus data-custom-size={customSize} /> : <></>}
        </Text>
    );

    // 省略されている場合はツールチップで正確な値を表示
    if (isCompacted) {
        return (
            <Tooltip
                label={value.toLocaleString(locales, formatOptions)}
                withArrow
            >
                {content}
            </Tooltip>
        );
    }

    return content;
};
