import { Card, Group, Paper, Skeleton, Stack } from "@mantine/core";

const repeat = (count: number) => Array.from({ length: count }, (_, index) => index);

export const StatCardSkeleton = () => (
    <Card
        padding="md"
        radius="md"
        withBorder
    >
        <Stack gap="md">
            <Group
                justify="space-between"
                align="flex-start"
            >
                <Skeleton
                    height={16}
                    width="45%"
                    radius="md"
                />
                <Skeleton
                    height={24}
                    width={24}
                    radius="xl"
                />
            </Group>
            <Skeleton
                height={32}
                width="70%"
                radius="md"
            />
            <Skeleton
                height={12}
                width="35%"
                radius="md"
            />
        </Stack>
    </Card>
);

export const UserBalanceCardSkeleton = () => (
    <Card
        padding="md"
        radius="md"
        bg="gray.1"
        withBorder={false}
    >
        <Stack gap="md">
            <Group
                justify="space-between"
                align="flex-start"
            >
                <Skeleton
                    height={16}
                    width="40%"
                    radius="md"
                />
                <Skeleton
                    height={24}
                    width={24}
                    radius="xl"
                />
            </Group>
            <Skeleton
                height={32}
                width="65%"
                radius="md"
            />
            <Group gap="xs">
                <Skeleton
                    height={12}
                    width="20%"
                    radius="md"
                />
                <Skeleton
                    height={12}
                    width="30%"
                    radius="md"
                />
            </Group>
        </Stack>
    </Card>
);

export const RecentTransactionsCardSkeleton = () => (
    <Card
        padding="lg"
        radius="md"
        withBorder
        h="100%"
        style={{ display: "flex", flexDirection: "column" }}
    >
        <Group
            justify="space-between"
            mb="md"
        >
            <Skeleton
                height={18}
                width="40%"
                radius="md"
            />
            <Skeleton
                height={28}
                width={28}
                radius="xl"
            />
        </Group>
        <Stack
            gap="sm"
            style={{ flex: 1 }}
        >
            {repeat(5).map(index => (
                <Stack
                    key={`transactions-skeleton-${index}`}
                    gap={4}
                >
                    <Group justify="space-between">
                        <Skeleton
                            height={14}
                            width="45%"
                            radius="md"
                        />
                        <Skeleton
                            height={14}
                            width="30%"
                            radius="md"
                        />
                    </Group>
                    <Skeleton
                        height={12}
                        width="65%"
                        radius="md"
                    />
                </Stack>
            ))}
        </Stack>
    </Card>
);

export const RankingCardSkeleton = () => (
    <Paper
        p="lg"
        radius="md"
        withBorder
    >
        <Stack gap="md">
            <Skeleton
                height={20}
                width="50%"
                radius="md"
            />
            <Group gap="sm">
                {repeat(3).map(index => (
                    <Stack
                        key={`ranking-top-skeleton-${index}`}
                        gap={6}
                        style={{ flex: 1 }}
                    >
                        <Skeleton
                            height={56}
                            radius="md"
                        />
                        <Skeleton
                            height={12}
                            width="60%"
                            radius="md"
                        />
                    </Stack>
                ))}
            </Group>
            <Stack gap="sm">
                {repeat(4).map(index => (
                    <Group
                        key={`ranking-list-skeleton-${index}`}
                        gap="sm"
                        align="center"
                    >
                        <Skeleton
                            height={14}
                            width={24}
                            radius="md"
                        />
                        <Skeleton
                            height={14}
                            width="65%"
                            radius="md"
                        />
                        <Skeleton
                            height={14}
                            width="15%"
                            radius="md"
                        />
                    </Group>
                ))}
            </Stack>
        </Stack>
    </Paper>
);
