import { type MantineSize, Text, type TextProps } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";

import CopiaIcon from "/@/assets/icons/copia.svg?react";
import type { Copia } from "/@/types/entity";

export type PAmountSize = MantineSize | "custom" | undefined;

export type PAmountProps<Size extends PAmountSize> = TextProps & {
    size?: Size;
    leadingIcon?: boolean;
    trailingDash?: boolean;
    coloring?: boolean;
    formatOptions?: BigIntToLocaleStringOptions;
    locales?: Intl.LocalesArgument;
    value: Copia;
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
        formatOptions,
        size,
        locales,
        value,
        ...props
    } = _props;

    const customSize = isCustomSize(_props) ? _props.customSize : null;
    const color = value > 0 ? "green" : value < 0 ? "red" : "black";

    return (
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
                    className="inline -mx-1"
                    data-custom-size={customSize}
                />
            ) : (
                <></>
            )}
            <span className="value">{value.toLocaleString(locales, formatOptions)}</span>
            {trailingDash ? <IconMinus data-custom-size={customSize} /> : <></>}
        </Text>
    );
};
