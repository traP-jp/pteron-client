import { Accordion, Group, Stack, Text } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

import type { Transaction } from "/@/api/schema/public";
import { toBranded } from "/@/types/entity";
import type { Copia, ProjectName, UserName } from "/@/types/entity";

import { PAmount } from "./PAmount";
import { PAvatar } from "./PAvatar";

export interface TransactionItemProps {
    transaction: Transaction;
    direction?: "from" | "to" | "both";
}

export const TransactionItem = ({ transaction, direction = "both" }: TransactionItemProps) => {
    const isTransfer = transaction.type === "TRANSFER";
    const from = isTransfer ? "project" : "user";
    const to = isTransfer ? "user" : "project";

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
        return toBranded<ProjectName>(transaction.project.name);
    };

    const getUserName = () => {
        return toBranded<UserName>(transaction.user.name);
    };

    const fromAvatar = (
        <PAvatar
            size="md"
            type={from}
            name={from === "user" ? getUserName() : getProjectName()}
        />
    );
    const toAvatar = (
        <PAvatar
            size="md"
            type={to}
            name={to === "user" ? getUserName() : getProjectName()}
        />
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
                    justify="space-between"
                    wrap="nowrap"
                >
                    <Group gap="md">
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
                    </Group>

                    <Stack
                        gap="xs"
                        align="flex-end"
                    >
                        <PAmount
                            value={toBranded<Copia>(BigInt(transaction.amount || 0))}
                            leadingIcon
                            fw={600}
                            size="lg"
                        />
                        <Text
                            size="xs"
                            c="dimmed"
                        >
                            {formatDate(transaction.created_at)}
                        </Text>
                    </Stack>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Stack gap="sm">
                    <Group gap="md">
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
                        <Text
                            size="sm"
                            c="dimmed"
                        >
                            →
                        </Text>
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
                        <Text size="sm">{formatDate(transaction.created_at)}</Text>
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
