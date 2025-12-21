import { Card, Group, Stack, Text } from "@mantine/core";
import { IconCoin } from "@tabler/icons-react";

import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { type Copia, toBranded } from "/@/types/entity";

interface SystemTotalCardProps {
    total: number;
}

export const SystemTotalCard = ({ total }: SystemTotalCardProps) => {
    return (
        <Card
            padding="md"
            radius="md"
            withBorder
        >
            <ErrorBoundary>
                <Stack gap="md">
                    <Group
                        justify="space-between"
                        align="flex-start"
                    >
                        <Text
                            size="lg"
                            fw={600}
                        >
                            総取引額
                        </Text>
                        <IconCoin
                            size={20}
                            style={{ color: "var(--mantine-color-green-6)" }}
                        />
                    </Group>
                    <PAmount
                        value={toBranded<Copia>(BigInt(total))}
                        leadingIcon
                        compact
                        size="lg"
                        fw={700}
                    />
                    <Text
                        size="xs"
                        c="dimmed"
                        mt="xs"
                    >
                        過去7日
                    </Text>
                </Stack>
            </ErrorBoundary>
        </Card>
    );
};
