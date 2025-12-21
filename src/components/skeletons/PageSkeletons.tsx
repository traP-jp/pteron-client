import {
    Card,
    Center,
    Container,
    Divider,
    Flex,
    Group,
    Paper,
    SimpleGrid,
    Skeleton,
    Stack,
} from "@mantine/core";

const range = (count: number) => Array.from({ length: count }, (_, index) => index);

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
        style={{
            backgroundColor: "light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))",
        }}
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
            align="center"
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
            {range(5).map(index => (
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
                {range(3).map(index => (
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
                {range(4).map(index => (
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

export const EntityCardSkeleton = () => (
    <Card
        withBorder
        radius="md"
        p="xl"
    >
        <Stack gap="md">
            <Group gap="md">
                <Skeleton
                    height={48}
                    width={48}
                    radius="xl"
                />
                <Stack
                    gap={4}
                    style={{ flex: 1 }}
                >
                    <Skeleton
                        height={14}
                        width="60%"
                        radius="md"
                    />
                    <Skeleton
                        height={12}
                        width="40%"
                        radius="md"
                    />
                </Stack>
            </Group>
            <Skeleton
                height={24}
                width="50%"
                radius="md"
            />
            <Skeleton
                height={12}
                width="30%"
                radius="md"
            />
        </Stack>
    </Card>
);

export const EntityGridSkeleton = ({ count = 6 }: { count?: number }) => (
    <SimpleGrid
        cols={{ base: 1, md: 2, xl: 3 }}
        spacing="md"
    >
        {range(count).map(index => (
            <EntityCardSkeleton key={`entity-card-skeleton-${index}`} />
        ))}
    </SimpleGrid>
);

const SectionTitleSkeleton = ({ width = "30%" }: { width?: number | string }) => (
    <Skeleton
        height={20}
        width={width}
        radius="md"
    />
);

const ProfileHeaderSkeleton = () => (
    <Stack gap="sm">
        <Group
            justify="space-between"
            align="center"
            gap="xl"
            wrap="wrap"
        >
            <Group
                gap="md"
                align="center"
            >
                <Skeleton
                    height={72}
                    width={72}
                    radius="100%"
                />
                <Stack gap={6}>
                    <Skeleton
                        height={20}
                        width={200}
                        radius="md"
                    />
                    <Skeleton
                        height={16}
                        width={140}
                        radius="md"
                    />
                </Stack>
            </Group>
            <Skeleton
                height={36}
                width={200}
                radius="md"
            />
        </Group>
        <RankingBadgesSkeleton />
    </Stack>
);

const TimelineSkeleton = ({ rows = 6 }: { rows?: number }) => (
    <Stack gap="sm">
        {range(rows).map(index => (
            <Stack
                key={`timeline-row-${index}`}
                gap={4}
            >
                <Group justify="space-between">
                    <Skeleton
                        height={14}
                        width="40%"
                        radius="md"
                    />
                    <Skeleton
                        height={14}
                        width="25%"
                        radius="md"
                    />
                </Group>
                <Skeleton
                    height={12}
                    width="60%"
                    radius="md"
                />
            </Stack>
        ))}
    </Stack>
);

const InsightSectionSkeleton = () => (
    <Flex
        wrap="wrap"
        gap="md"
    >
        <Card
            className="flex-auto"
            p="lg"
            h="100%"
        >
            <Skeleton
                height={20}
                width="40%"
                radius="md"
                mb="md"
            />
            <Skeleton
                height={320}
                radius="md"
            />
        </Card>

        <Divider
            orientation="vertical"
            visibleFrom="sm"
        />

        <Card
            className="w-full sm:w-auto sm:min-w-md"
            p="lg"
            h="100%"
            style={{ display: "flex", flexDirection: "column" }}
        >
            <Skeleton
                height={20}
                width="40%"
                radius="md"
                mb="md"
            />
            <div className="h-80 overflow-auto">
                <TimelineSkeleton rows={5} />
            </div>
        </Card>
    </Flex>
);

export const RankingBadgesSkeleton = ({ count = 3 }: { count?: number }) => (
    <Group gap="xs">
        {range(count).map(index => (
            <Skeleton
                key={`ranking-badge-${index}`}
                height={32}
                width={140}
                radius="xl"
            />
        ))}
    </Group>
);

export const RankingCardsSkeleton = ({ count = 6 }: { count?: number }) => (
    <SimpleGrid
        cols={{ base: 1, md: 2, xl: 3 }}
        spacing="md"
    >
        {range(count).map(index => (
            <Stack
                key={`ranking-card-${index}`}
                gap={0}
                style={{
                    border: "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
                    borderRadius: 8,
                    backgroundColor:
                        "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
                }}
            >
                <Flex
                    p="sm"
                    direction="column"
                    gap="xs"
                >
                    <Skeleton
                        height={12}
                        width="50%"
                        radius="md"
                    />
                    <Group
                        gap="sm"
                        justify="space-between"
                        align="center"
                    >
                        <Group gap="sm">
                            <Skeleton
                                height={24}
                                width={24}
                                radius="md"
                            />
                            <Skeleton
                                height={14}
                                width={100}
                                radius="md"
                            />
                        </Group>
                        <Skeleton
                            height={14}
                            width={60}
                            radius="md"
                        />
                    </Group>
                </Flex>
            </Stack>
        ))}
    </SimpleGrid>
);

export const UsersPageSkeleton = () => (
    <Stack
        gap="md"
        p="md"
    >
        <Skeleton
            height={32}
            width="30%"
            radius="md"
        />
        <Flex
            direction="row"
            justify="space-between"
            align="center"
            wrap="wrap"
            gap="md"
        >
            <Skeleton
                height={20}
                width={200}
                radius="md"
            />
            <Skeleton
                height={36}
                width={200}
                radius="md"
            />
        </Flex>
        <EntityGridSkeleton />
    </Stack>
);

export const UserDetailsSkeleton = () => (
    <Stack
        gap="md"
        p="md"
    >
        <ProfileHeaderSkeleton />
        <Divider />
        <InsightSectionSkeleton />
        <Divider />
        <SectionTitleSkeleton width="25%" />
        <EntityGridSkeleton count={3} />
        <Divider />
        <SectionTitleSkeleton width="20%" />
        <RankingCardsSkeleton />
    </Stack>
);

export const ProjectDetailsSkeleton = () => (
    <Stack
        gap="md"
        p="md"
    >
        <ProfileHeaderSkeleton />
        <Divider />
        <InsightSectionSkeleton />
        <Divider />
        <SectionTitleSkeleton width="25%" />
        <EntityGridSkeleton count={3} />
        <Divider />
        <SectionTitleSkeleton width="20%" />
        <RankingCardsSkeleton />
    </Stack>
);

export const RankingDetailSkeleton = () => (
    <Stack gap="md">
        <Group
            gap="md"
            align="center"
        >
            <Skeleton
                height={40}
                width={40}
                radius="xl"
            />
            <Skeleton
                height={28}
                width="40%"
                radius="md"
            />
        </Group>
        <RankingCardSkeleton />
        <Center>
            <Skeleton
                height={32}
                width={200}
                radius="xl"
            />
        </Center>
    </Stack>
);

export const CheckoutPageSkeleton = () => (
    <Container className="relative h-screen overflow-hidden">
        <Stack
            h="100%"
            justify="center"
            gap="lg"
            align="center"
        >
            <Skeleton
                height={40}
                width={160}
                radius="md"
            />
            <Card
                radius="md"
                withBorder
                p="xl"
                style={{ width: "min(420px, 90%)" }}
            >
                <Stack gap="md">
                    <Skeleton
                        height={24}
                        width="60%"
                        radius="md"
                    />
                    <Skeleton
                        height={18}
                        width="80%"
                        radius="md"
                    />
                    <Skeleton
                        height={18}
                        width="70%"
                        radius="md"
                    />
                    <Divider />
                    <Skeleton
                        height={48}
                        width="100%"
                        radius="md"
                    />
                    <Skeleton
                        height={48}
                        width="100%"
                        radius="md"
                    />
                    <Skeleton
                        height={48}
                        width="60%"
                        radius="md"
                        style={{ alignSelf: "center" }}
                    />
                </Stack>
            </Card>
        </Stack>
    </Container>
);

export const EditProjectModalSkeleton = () => (
    <Stack gap="md">
        <SectionTitleSkeleton width="50%" />
        {range(3).map(index => (
            <Skeleton
                key={`modal-field-${index}`}
                height={40}
                radius="md"
            />
        ))}
        <Divider />
        <SectionTitleSkeleton width="45%" />
        {range(2).map(index => (
            <Skeleton
                key={`modal-small-field-${index}`}
                height={32}
                radius="md"
            />
        ))}
        <Skeleton
            height={48}
            radius="md"
        />
    </Stack>
);
