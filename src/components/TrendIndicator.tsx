import { Text } from "@mantine/core";
import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react";

export const TrendIndicator = (diff: number) => {
    const iconSize = 16;
    const strokeWidth = 3;

    if (diff > 0) {
        return (
            <Text
                c="green"
                className="flex flex-row items-center h-7"
                fw={700}
            >
                <IconArrowUpRight
                    stroke={strokeWidth}
                    color="var(--mantine-color-green-text)"
                    size={iconSize}
                    className="inline"
                />
                {diff}
            </Text>
        );
    } else if (diff < 0) {
        return (
            <Text
                c="red"
                className="flex flex-row items-center h-7"
                fw={700}
            >
                <IconArrowDownRight
                    stroke={strokeWidth}
                    size={iconSize}
                    className="inline"
                />
                {-diff}
            </Text>
        );
    } else {
        return (
            <Text
                c="gray"
                className="flex flex-row items-center h-7"
                fw={700}
            >
                <IconMinus
                    stroke={strokeWidth}
                    size={iconSize}
                    className="inline"
                />
            </Text>
        );
    }
};
