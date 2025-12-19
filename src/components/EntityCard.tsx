import { Card, type CardProps, Flex, Group, Text } from "@mantine/core";

import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import type { Amount } from "/@/types/amount";
import type { UserOrProject, UserOrProjectType } from "/@/types/userOrProject";

import { MaybeLink } from "./MaybeLink";

import { type Url, toBranded } from "../types/entity";
import type { Href } from "../types/href";

export type EntityCardProps<Type extends UserOrProjectType> = CardProps &
    Amount &
    UserOrProject<Type> &
    Partial<Href>;

export const EntityCard = <Type extends UserOrProjectType>({
    type,
    name,
    amount,
    href = toBranded<Url>(""),
    ...props
}: EntityCardProps<Type>) => {
    return (
        <Card {...props}>
            <Card.Section>
                <Group>
                    <MaybeLink
                        to={href}
                        className={`${href ? "" : "pointer-events-none"}`}
                    >
                        <PAvatar
                            size="md"
                            type={type}
                            name={name}
                        />
                    </MaybeLink>

                    <Flex direction="column">
                        <MaybeLink to={href}>
                            <Text
                                size="md"
                                fw={500}
                            >
                                {name}
                            </Text>
                        </MaybeLink>

                        <PAmount
                            size="custom"
                            customSize={0.8}
                            value={amount}
                            leadingIcon
                            coloring
                        />
                    </Flex>
                </Group>
            </Card.Section>
        </Card>
    );
};
