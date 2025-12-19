import { ActionIcon, Card, type CardProps, Flex, Group, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import type { Amount } from "/@/types/amount";
import type { UserOrProject, UserOrProjectType } from "/@/types/userOrProject";

import { MaybeLink } from "./MaybeLink";
import { createExternalLinkHander } from "./lib/link";

import { type Url, toBranded } from "../types/entity";
import type { Href } from "../types/href";

export type EntityCardProps<Type extends UserOrProjectType> = CardProps &
    Amount &
    UserOrProject<Type> &
    Partial<Href> & {
        extraLink?: Url;
    };

export const EntityCard = <Type extends UserOrProjectType>({
    type,
    name,
    amount,
    href = toBranded<Url>(""),
    extraLink = toBranded<Url>(""),
    ...props
}: EntityCardProps<Type>) => {
    const handleExternalLinkClick = createExternalLinkHander(href);

    return (
        <Card {...props}>
            <Card.Section>
                <Group>
                    <MaybeLink to={href}>
                        <PAvatar
                            size="md"
                            type={type}
                            name={name}
                        />
                    </MaybeLink>

                    <Flex direction="column">
                        <Flex
                            direction="row"
                            align="center"
                        >
                            <MaybeLink to={href}>
                                <Text
                                    size="md"
                                    fw={500}
                                >
                                    {name}
                                </Text>
                            </MaybeLink>

                            {extraLink ? (
                                <ActionIcon
                                    aria-label="サイトを開く"
                                    color="gray"
                                    onClick={handleExternalLinkClick}
                                    size="sm"
                                    variant="subtle"
                                >
                                    <IconExternalLink size={16} />
                                </ActionIcon>
                            ) : (
                                <></>
                            )}
                        </Flex>

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
