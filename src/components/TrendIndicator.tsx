import { Text, type TextProps } from "@mantine/core";
import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react";

export interface TrendIndicatorProps extends TextProps {
    diff: number;
}

export const TrendIndicator = ({ diff, ...props }: TrendIndicatorProps) => {
    const color = diff > 0 ? "green" : diff < 0 ? "red" : "gray";
    const iconProps = {
        stroke: 3,
        size: 16,
        className: "inline",
    };
    const icon =
        diff > 0 ? (
            <IconArrowUpRight {...iconProps} />
        ) : diff < 0 ? (
            <IconArrowDownRight {...iconProps} />
        ) : (
            <IconMinus {...iconProps} />
        );

    return (
        <Text
            c={color}
            className="flex flex-row items-center h-7"
            fw={700}
            {...props}
        >
            {icon}
            {diff !== 0 ? Math.abs(diff) : ""}
        </Text>
    );
};
