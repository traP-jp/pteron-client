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

export type PAmountProps<Size extends PAmountSize> = TextProps & {
    size?: Size;
    leadingIcon?: boolean;
    trailingDash?: boolean;
    coloring?: boolean;
    formatOptions?: BigIntToLocaleStringOptions;
    locales?: Intl.LocalesArgument;
    value: Copia;
    /** 大きな数値を省略表示する（K, M, Bなど） */
    compact?: boolean;
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
        compact = false,
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
    const displayValue = compact
        ? formatCompact(value)
        : value.toLocaleString(locales, formatOptions);
    // 省略されている場合のみツールチップを表示
    const isCompacted = compact && (value >= 1000n || value <= -1000n);

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
