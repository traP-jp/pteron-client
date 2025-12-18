import { Group, Text, UnstyledButton, type UnstyledButtonProps } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import classes from "/@/styles/entity-card.module.scss";
import type { Amount } from "/@/types/amount";
import type { UserOrProject, UserOrProjectType } from "/@/types/userOrProject";

export type EntityCardProps<Type extends UserOrProjectType> = UnstyledButtonProps &
    Amount &
    UserOrProject<Type>;

export const EntityCard = <Type extends UserOrProjectType>({
    type,
    name,
    amount,
    ...props
}: EntityCardProps<Type>) => {
    return (
        <UnstyledButton
            className={classes.root}
            {...props}
        >
            <Group>
                <PAvatar
                    type={type}
                    name={name}
                />

                <div style={{ flex: 1 }}>
                    <Text
                        size="sm"
                        fw={500}
                    >
                        {name}
                    </Text>

                    <PAmount
                        value={amount}
                        leadingIcon
                        coloring
                    />
                </div>

                <IconChevronRight
                    size={14}
                    stroke={1.5}
                />
            </Group>
        </UnstyledButton>
    );
};
