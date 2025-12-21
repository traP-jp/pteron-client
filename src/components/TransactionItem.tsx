import { Link } from "react-router-dom";

import { Accordion, Anchor, Flex, Group, Stack, Text } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

import type { Transaction } from "/@/api/schema/internal";
import { toBranded } from "/@/types/entity";
import type { Copia, ProjectName, UserName } from "/@/types/entity";

import { PAmount } from "./PAmount";
import { PAvatar } from "./PAvatar";

import type { EntityType } from "../types/composed";

export interface TransactionItemProps {
    transaction: Transaction;
    direction?: "from" | "to" | "both";
}

export const TransactionItem = ({ transaction, direction = "both" }: TransactionItemProps) => {
    const isTransfer = transaction.type === "TRANSFER";

    const from: EntityType =
        transaction.type === "SYSTEM" ? "system" : isTransfer ? "project" : "user";
    const to: EntityType =
        transaction.type === "SYSTEM"
            ? transaction.user
                ? "user"
                : "project"
            : isTransfer
              ? "user"
              : "project";

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getProjectName = () => {
        return toBranded<ProjectName>(transaction.project?.name ?? "");
    };

    const getUserName = () => {
        return toBranded<UserName>(transaction.user?.name ?? "");
    };

    const getPath = (x: EntityType) => {
        return x === "user"
            ? `/users/${getUserName()}`
            : x === "project"
              ? `/projects/${getProjectName()}`
              : "";
    };

    const fromAvatar = (
        <Anchor
            component={Link}
            to={getPath(to)}
            onClick={e => e.stopPropagation()}
            c="inherit"
        >
            <PAvatar
                size="md"
                type={from}
                name={from === "user" ? getUserName() : getProjectName()}
            />
        </Anchor>
    );
    const toAvatar = (
        <Anchor
            component={Link}
            to={getPath(to)}
            onClick={e => e.stopPropagation()}
            c="inherit"
        >
            <PAvatar
                size="md"
                type={to}
                name={to === "user" ? getUserName() : getProjectName()}
            />
        </Anchor>
    );
    const arrowRight = (
        <IconArrowRight
            size={20}
            stroke={1.5}
            style={{ color: "var(--mantine-color-dimmed)" }}
        />
    );
    const arrowLeft = (
        <IconArrowLeft
            size={20}
            stroke={1.5}
            style={{ color: "var(--mantine-color-dimmed)" }}
        />
    );

    return (
        <Accordion.Item
            key={transaction.id}
            value={transaction.id || ""}
        >
            <Accordion.Control>
                <Group
                    px="xs"
                    justify="space-between"
                    wrap="wrap"
                >
                    <Flex
                        gap="md"
                        align="center"
                    >
                        {direction === "from" && (
                            <>
                                {fromAvatar}
                                {arrowRight}
                            </>
                        )}
                        {direction === "to" && (
                            <>
                                {toAvatar}
                                {arrowLeft}
                            </>
                        )}
                        {direction === "both" && (
                            <>
                                {fromAvatar}
                                {arrowRight}
                                {toAvatar}
                            </>
                        )}
                    </Flex>

                    <Flex
                        direction={{ base: "column", xs: "row" }}
                        align={{ base: "flex-start", xs: "center" }}
                        gap="sm"
                    >
                        <Text
                            size="xs"
                            c="dimmed"
                            display={{ base: "none", xs: "contents" }}
                        >
                            {formatDate(transaction.createdAt)}
                        </Text>
                        <PAmount
                            value={toBranded<Copia>(
                                BigInt(
                                    direction === "to"
                                        ? -1 * transaction.amount
                                        : transaction.amount
                                )
                            )}
                            leadingIcon
                            coloring={direction !== "both"}
                            compact
                            fw={600}
                            size="lg"
                        />
                        <Text
                            size="xs"
                            c="dimmed"
                            display={{ base: "flex", xs: "none" }}
                        >
                            {formatDate(transaction.createdAt)}
                        </Text>
                    </Flex>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Stack gap="sm">
                    <Group gap="md">
                        <Anchor
                            component={Link}
                            to={getPath(from)}
                            underline="never"
                            c="inherit"
                        >
                            <Group gap="xs">
                                <PAvatar
                                    size="sm"
                                    type={from}
                                    name={from === "user" ? getUserName() : getProjectName()}
                                />
                                <Text size="sm">
                                    {from === "user" ? getUserName() : getProjectName()}
                                </Text>
                            </Group>
                        </Anchor>
                        <Text
                            size="sm"
                            c="dimmed"
                        >
                            →
                        </Text>
                        <Anchor
                            component={Link}
                            to={getPath(to)}
                            underline="never"
                            c="inherit"
                        >
                            <Group gap="xs">
                                <PAvatar
                                    size="sm"
                                    type={to}
                                    name={to === "user" ? getUserName() : getProjectName()}
                                />
                                <Text size="sm">
                                    {to === "user" ? getUserName() : getProjectName()}
                                </Text>
                            </Group>
                        </Anchor>
                    </Group>
                    {transaction.description && (
                        <Group gap="xs">
                            <Text
                                size="sm"
                                fw={600}
                                c="dimmed"
                            >
                                説明:
                            </Text>
                            <Text size="sm">{transaction.description}</Text>
                        </Group>
                    )}
                    <Group gap="xs">
                        <Text
                            size="sm"
                            fw={600}
                            c="dimmed"
                        >
                            金額:
                        </Text>
                        <PAmount
                            value={toBranded<Copia>(BigInt(transaction.amount || 0))}
                            leadingIcon
                            size="sm"
                        />
                    </Group>
                    <Group gap="xs">
                        <Text
                            size="sm"
                            fw={600}
                            c="dimmed"
                        >
                            日時:
                        </Text>
                        <Text size="sm">{formatDate(transaction.createdAt)}</Text>
                    </Group>
                    <Group gap="xs">
                        <Text
                            size="xs"
                            c="dimmed"
                            ff="monospace"
                        >
                            {transaction.id}
                        </Text>
                    </Group>
                </Stack>
            </Accordion.Panel>
        </Accordion.Item>
    );
};
