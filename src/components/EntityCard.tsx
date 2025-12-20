import { ActionIcon, Card, type CardProps, Flex, Group, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import { buildProjectPageUrl, buildUserPageUrl } from "/@/api";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { createExternalLinkHander } from "/@/lib/link";
import type { Amount } from "/@/types/amount";
import { type Entity, type EntityType, isProject, isUser } from "/@/types/composed";
import { type Url, toBranded } from "/@/types/entity";
import type { Href } from "/@/types/href";

import { MaybeLink } from "./MaybeLink";

export type EntityCardProps<Type extends EntityType> = CardProps &
    Amount &
    Entity<Type> &
    Partial<Href> & {
        extraLink?: Url;
    };

export const EntityCard = <Type extends EntityType>(_props: EntityCardProps<Type>) => {
    const { type, name, amount, href: _href, extraLink = toBranded<Url>(""), ...props } = _props;

    const href =
        _href ??
        (isUser(_props)
            ? buildUserPageUrl(_props.name)
            : isProject(_props)
              ? buildProjectPageUrl(_props.name)
              : undefined);

    const handleExternalLinkClick = createExternalLinkHander(extraLink);

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
