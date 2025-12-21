import { Suspense, use, useMemo } from "react";
import { Link } from "react-router-dom";

import {
    Anchor,
    Badge,
    Flex,
    Group,
    Loader,
    SimpleGrid,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";

import apis from "/@/api";
import type { Copia, ProjectName, UserName } from "/@/types/entity";
import { toBranded } from "/@/types/entity";

import ErrorBoundary from "../ErrorBoundary";
import { PAmount } from "../PAmount";
import { PAvatar } from "../PAvatar";
import { TrendIndicator } from "../TrendIndicator";

type RankingName = "balance" | "difference" | "in" | "out" | "count" | "total" | "ratio";
type Period = "24hours" | "7days" | "30days" | "365days";

interface RankingConfig {
    title: string;
    rankingName: RankingName;
}

const rankingTitles: Record<RankingName, string> = {
    balance: "残高ランキング",
    difference: "差額ランキング",
    in: "収入ランキング",
    out: "支出ランキング",
    count: "取引数ランキング",
    total: "総額ランキング",
    ratio: "比率ランキング",
};

// コピア単位のランキング
const copiaRankings: RankingName[] = ["balance", "difference", "in", "out", "total"];

// 負になり得ないランキング（カラーリングなし）
const nonNegativeRankings: RankingName[] = ["in", "out", "count", "total"];

const userRankingConfigs: RankingConfig[] = [
    { title: "残高", rankingName: "balance" },
    { title: "取引数", rankingName: "count" },
    { title: "収入", rankingName: "in" },
    { title: "支出", rankingName: "out" },
    { title: "差額", rankingName: "difference" },
    { title: "総額", rankingName: "total" },
];

const allRankingConfigs: RankingConfig[] = [
    { title: "残高", rankingName: "balance" },
    { title: "差額", rankingName: "difference" },
    { title: "収入", rankingName: "in" },
    { title: "支出", rankingName: "out" },
    { title: "取引数", rankingName: "count" },
    { title: "総額", rankingName: "total" },
];

const projectRankingConfigs: RankingConfig[] = [
    { title: "残高", rankingName: "balance" },
    { title: "取引数", rankingName: "count" },
    { title: "収入", rankingName: "in" },
    { title: "支出", rankingName: "out" },
    { title: "差額", rankingName: "difference" },
    { title: "総額", rankingName: "total" },
];

interface RankInfo {
    title: string;
    rankingName: RankingName;
    rank: number | null;
}

interface RankingBadgesContentProps {
    fetcher: Promise<RankInfo[]>;
    type: "user" | "project";
}

const getBadgeColor = (rank: number | null) => {
    if (rank === null) return "gray";
    if (rank === 1) return "yellow";
    if (rank === 2) return "gray.5";
    if (rank === 3) return "orange";
    if (rank <= 10) return "cyan";
    return "gray";
};

const RankingBadgesContent = ({ fetcher, type }: RankingBadgesContentProps) => {
    const rankings = use(fetcher);

    // 10位以内のみフィルタリング
    const topRankings = rankings.filter(r => r.rank !== null && r.rank <= 10);

    if (topRankings.length === 0) {
        return null;
    }

    return (
        <Group gap="xs">
            {topRankings.map(({ title, rankingName, rank }) => (
                <Tooltip
                    key={rankingName}
                    label={`${title}ランキング ${rank}位`}
                    withArrow
                >
                    <Anchor
                        component={Link}
                        to={`/stats/${type === "user" ? "users" : "projects"}/${rankingName}`}
                        underline="never"
                    >
                        <Badge
                            color={getBadgeColor(rank)}
                            variant="light"
                            leftSection={<IconTrophy size={14} />}
                            size="lg"
                        >
                            {title}: {rank}位
                        </Badge>
                    </Anchor>
                </Tooltip>
            ))}
        </Group>
    );
};

interface UserRankingBadgesProps {
    userName: UserName;
    period?: Period;
}

export const UserRankingBadges = ({ userName, period = "7days" }: UserRankingBadgesProps) => {
    const fetcher = useMemo(
        () =>
            Promise.all(
                userRankingConfigs.map(async config => {
                    try {
                        const response = await apis.internal.stats.getUserRankings(
                            config.rankingName,
                            {
                                term: period,
                                limit: 100,
                            }
                        );
                        const item = response.data.items?.find(i => i.user.name === userName);
                        return {
                            ...config,
                            rank: item?.rank ?? null,
                        };
                    } catch {
                        return { ...config, rank: null };
                    }
                })
            ),
        [userName, period]
    );

    return (
        <ErrorBoundary>
            <Suspense fallback={<Loader size="xs" />}>
                <RankingBadgesContent
                    fetcher={fetcher}
                    type="user"
                />
            </Suspense>
        </ErrorBoundary>
    );
};

interface ProjectRankingBadgesProps {
    projectName: ProjectName;
    period?: Period;
}

export const ProjectRankingBadges = ({
    projectName,
    period = "7days",
}: ProjectRankingBadgesProps) => {
    const fetcher = useMemo(
        () =>
            Promise.all(
                projectRankingConfigs.map(async config => {
                    try {
                        const response = await apis.internal.stats.getProjectRankings(
                            config.rankingName,
                            {
                                term: period,
                                limit: 100,
                            }
                        );
                        const item = response.data.items?.find(i => i.project.name === projectName);
                        return {
                            ...config,
                            rank: item?.rank ?? null,
                        };
                    } catch {
                        return { ...config, rank: null };
                    }
                })
            ),
        [projectName, period]
    );

    return (
        <ErrorBoundary>
            <Suspense fallback={<Loader size="xs" />}>
                <RankingBadgesContent
                    fetcher={fetcher}
                    type="project"
                />
            </Suspense>
        </ErrorBoundary>
    );
};

// =====================================================
// ランキング詳細カードコンポーネント
// =====================================================

interface RankingDetailInfo {
    rankingName: RankingName;
    rank: number | null;
    rankDiff: number | null;
    value: number | null;
}

interface RankingCardItemProps {
    type: "user" | "project";
    name: string;
    info: RankingDetailInfo;
}

const RankingCardItem = ({ type, name, info }: RankingCardItemProps) => {
    const { rankingName, rank, rankDiff, value } = info;
    const rankingDetailPath = `/stats/${type === "user" ? "users" : "projects"}/${rankingName}`;
    const entityDetailPath = type === "user" ? `/users/${name}` : `/projects/${name}`;

    if (rank === null) {
        return (
            <Flex
                p="sm"
                direction="column"
                gap="xs"
            >
                <Anchor
                    component={Link}
                    to={rankingDetailPath}
                    underline="hover"
                    c="dimmed"
                    size="sm"
                    fw={500}
                >
                    {rankingTitles[rankingName]}
                </Anchor>
                <Text
                    size="sm"
                    c="dimmed"
                >
                    圏外
                </Text>
            </Flex>
        );
    }

    return (
        <Flex
            p="sm"
            direction="column"
            gap="xs"
        >
            <Anchor
                component={Link}
                to={rankingDetailPath}
                underline="hover"
                c="dimmed"
                size="sm"
                fw={500}
            >
                {rankingTitles[rankingName]}
            </Anchor>
            <Group
                justify="space-between"
                wrap="nowrap"
            >
                <Group
                    gap="sm"
                    wrap="nowrap"
                >
                    <Text
                        fw={600}
                        size="sm"
                        w={24}
                        ta="center"
                    >
                        {rank}
                    </Text>
                    {rankDiff !== null && (
                        <TrendIndicator
                            diff={rankDiff}
                            size="xs"
                        />
                    )}
                    <Anchor
                        component={Link}
                        to={entityDetailPath}
                        underline="never"
                        c="inherit"
                    >
                        <Group
                            gap="xs"
                            wrap="nowrap"
                        >
                            <PAvatar
                                size="sm"
                                type={type}
                                name={
                                    type === "user"
                                        ? toBranded<UserName>(name)
                                        : toBranded<ProjectName>(name)
                                }
                            />
                            <Text
                                size="sm"
                                truncate
                                maw={100}
                            >
                                {name}
                            </Text>
                        </Group>
                    </Anchor>
                </Group>
                {value !== null &&
                    (copiaRankings.includes(rankingName) ? (
                        <PAmount
                            value={toBranded<Copia>(BigInt(value))}
                            compact
                            size="sm"
                            leadingIcon
                            coloring={!nonNegativeRankings.includes(rankingName)}
                        />
                    ) : (
                        <Text
                            size="sm"
                            fw={500}
                        >
                            {rankingName === "count" ? `${value}回` : `${value}%`}
                        </Text>
                    ))}
            </Group>
        </Flex>
    );
};

interface RankingCardsContentProps {
    fetcher: Promise<RankingDetailInfo[]>;
    type: "user" | "project";
    name: string;
}

const RankingCardsContent = ({ fetcher, type, name }: RankingCardsContentProps) => {
    const rankings = use(fetcher);

    return (
        <SimpleGrid
            cols={{ base: 1, md: 2, xl: 3 }}
            spacing="md"
        >
            {rankings.map(info => (
                <Stack
                    key={info.rankingName}
                    gap={0}
                    style={{
                        backgroundColor: "var(--mantine-color-gray-0)",
                        borderRadius: "var(--mantine-radius-md)",
                    }}
                >
                    <RankingCardItem
                        type={type}
                        name={name}
                        info={info}
                    />
                </Stack>
            ))}
        </SimpleGrid>
    );
};

interface UserRankingCardsProps {
    userName: UserName;
    period?: Period;
}

export const UserRankingCards = ({ userName, period = "7days" }: UserRankingCardsProps) => {
    const fetcher = useMemo(
        () =>
            Promise.all(
                allRankingConfigs.map(async config => {
                    try {
                        const response = await apis.internal.stats.getUserRankings(
                            config.rankingName,
                            {
                                term: period,
                                limit: 100,
                            }
                        );
                        const item = response.data.items?.find(i => i.user.name === userName);
                        return {
                            rankingName: config.rankingName,
                            rank: item?.rank ?? null,
                            rankDiff: item?.difference ?? null,
                            value: item?.value ?? null,
                        };
                    } catch {
                        return {
                            rankingName: config.rankingName,
                            rank: null,
                            rankDiff: null,
                            value: null,
                        };
                    }
                })
            ),
        [userName, period]
    );

    return (
        <ErrorBoundary>
            <Suspense
                fallback={
                    <SimpleGrid
                        cols={{ base: 1, md: 2, xl: 3 }}
                        spacing="md"
                    >
                        {allRankingConfigs.map(config => (
                            <Stack
                                key={config.rankingName}
                                gap={0}
                                style={{
                                    border: "1px solid var(--mantine-color-gray-3)",
                                    borderRadius: 8,
                                    backgroundColor: "var(--mantine-color-gray-0)",
                                }}
                            >
                                <Flex
                                    p="sm"
                                    direction="column"
                                    gap="xs"
                                >
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        fw={500}
                                    >
                                        {rankingTitles[config.rankingName]}
                                    </Text>
                                    <Loader size="sm" />
                                </Flex>
                            </Stack>
                        ))}
                    </SimpleGrid>
                }
            >
                <RankingCardsContent
                    fetcher={fetcher}
                    type="user"
                    name={userName}
                />
            </Suspense>
        </ErrorBoundary>
    );
};

interface ProjectRankingCardsProps {
    projectName: ProjectName;
    period?: Period;
}

export const ProjectRankingCards = ({
    projectName,
    period = "7days",
}: ProjectRankingCardsProps) => {
    const fetcher = useMemo(
        () =>
            Promise.all(
                allRankingConfigs.map(async config => {
                    try {
                        const response = await apis.internal.stats.getProjectRankings(
                            config.rankingName,
                            {
                                term: period,
                                limit: 100,
                            }
                        );
                        const item = response.data.items?.find(i => i.project.name === projectName);
                        return {
                            rankingName: config.rankingName,
                            rank: item?.rank ?? null,
                            rankDiff: item?.difference ?? null,
                            value: item?.value ?? null,
                        };
                    } catch {
                        return {
                            rankingName: config.rankingName,
                            rank: null,
                            rankDiff: null,
                            value: null,
                        };
                    }
                })
            ),
        [projectName, period]
    );

    return (
        <ErrorBoundary>
            <Suspense
                fallback={
                    <SimpleGrid
                        cols={{ base: 1, md: 2, xl: 3 }}
                        spacing="md"
                    >
                        {allRankingConfigs.map(config => (
                            <Stack
                                key={config.rankingName}
                                gap={0}
                                style={{
                                    border: "1px solid var(--mantine-color-gray-3)",
                                    borderRadius: 8,
                                    backgroundColor: "var(--mantine-color-gray-0)",
                                }}
                            >
                                <Flex
                                    p="sm"
                                    direction="column"
                                    gap="xs"
                                >
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        fw={500}
                                    >
                                        {rankingTitles[config.rankingName]}
                                    </Text>
                                    <Loader size="sm" />
                                </Flex>
                            </Stack>
                        ))}
                    </SimpleGrid>
                }
            >
                <RankingCardsContent
                    fetcher={fetcher}
                    type="project"
                    name={projectName}
                />
            </Suspense>
        </ErrorBoundary>
    );
};
