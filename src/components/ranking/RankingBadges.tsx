import { Suspense, use, useMemo } from "react";
import { Link } from "react-router-dom";

import { Anchor, Badge, Flex, Group, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";

import apis from "/@/api";
import type { Copia, ProjectName, UserName } from "/@/types/entity";
import { toBranded } from "/@/types/entity";

import ErrorBoundary from "../ErrorBoundary";
import { PAmount } from "../PAmount";
import { PAvatar } from "../PAvatar";
import { TrendIndicator } from "../TrendIndicator";
import { RankingBadgesSkeleton, RankingCardsSkeleton } from "../skeletons/PageSkeletons";

type RankingName = "balance" | "difference" | "in" | "out" | "count" | "total" | "ratio";
type Period = "24hours" | "7days" | "30days" | "365days";
type SortOrder = "desc" | "asc";

interface RankingConfig {
    title: string;
    rankingName: RankingName;
    order: SortOrder;
}

// コピア単位のランキング
const copiaRankings: RankingName[] = ["balance", "difference", "in", "out", "total"];

// 負になり得ないランキング（カラーリングなし）
const nonNegativeRankings: RankingName[] = ["in", "out", "count", "total"];

// ユーザー詳細ページ用: 6つのランキング項目
const userRankingConfigs: RankingConfig[] = [
    { title: "残高変動トップ", rankingName: "difference", order: "desc" },
    { title: "残高変動ワースト", rankingName: "difference", order: "asc" },
    { title: "残高トップ", rankingName: "balance", order: "desc" },
    { title: "残高ワースト", rankingName: "balance", order: "asc" },
    { title: "取引総額トップ", rankingName: "total", order: "desc" },
    { title: "支出トップ", rankingName: "out", order: "desc" },
];

// プロジェクト詳細ページ用: 6つのランキング項目
const projectRankingConfigs: RankingConfig[] = [
    { title: "残高変動トップ", rankingName: "difference", order: "desc" },
    { title: "残高変動ワースト", rankingName: "difference", order: "asc" },
    { title: "残高トップ", rankingName: "balance", order: "desc" },
    { title: "残高ワースト", rankingName: "balance", order: "asc" },
    { title: "取引総額トップ", rankingName: "total", order: "desc" },
    { title: "収入トップ", rankingName: "in", order: "desc" },
];

// カード表示用（すべてのランキング）
const allUserRankingConfigs: RankingConfig[] = [
    { title: "残高変動トップ", rankingName: "difference", order: "desc" },
    { title: "残高変動ワースト", rankingName: "difference", order: "asc" },
    { title: "残高トップ", rankingName: "balance", order: "desc" },
    { title: "残高ワースト", rankingName: "balance", order: "asc" },
    { title: "取引総額トップ", rankingName: "total", order: "desc" },
    { title: "支出トップ", rankingName: "out", order: "desc" },
];

const allProjectRankingConfigs: RankingConfig[] = [
    { title: "残高変動トップ", rankingName: "difference", order: "desc" },
    { title: "残高変動ワースト", rankingName: "difference", order: "asc" },
    { title: "残高トップ", rankingName: "balance", order: "desc" },
    { title: "残高ワースト", rankingName: "balance", order: "asc" },
    { title: "取引総額トップ", rankingName: "total", order: "desc" },
    { title: "収入トップ", rankingName: "in", order: "desc" },
];

interface RankInfo {
    title: string;
    rankingName: RankingName;
    order: SortOrder;
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

const getRankingPath = (type: "user" | "project", rankingName: RankingName, order: SortOrder) => {
    const baseType = type === "user" ? "users" : "projects";
    return `/stats/${baseType}/${rankingName}?order=${order}`;
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
            {topRankings.map(({ title, rankingName, order, rank }) => (
                <Tooltip
                    key={`${rankingName}-${order}`}
                    label={`${title} ${rank}位`}
                    withArrow
                >
                    <Anchor
                        component={Link}
                        to={getRankingPath(type, rankingName, order)}
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
                                order: config.order,
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
            <Suspense fallback={<RankingBadgesSkeleton />}>
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
                                order: config.order,
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
            <Suspense fallback={<RankingBadgesSkeleton />}>
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
    title: string;
    rankingName: RankingName;
    order: SortOrder;
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
    const { title, rankingName, order, rank, rankDiff, value } = info;
    const rankingDetailPath = getRankingPath(type, rankingName, order);
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
                    {title}
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
                {title}
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
                    key={`${info.rankingName}-${info.order}`}
                    gap={0}
                    style={{
                        backgroundColor:
                            "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
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
                allUserRankingConfigs.map(async config => {
                    try {
                        const response = await apis.internal.stats.getUserRankings(
                            config.rankingName,
                            {
                                term: period,
                                limit: 100,
                                order: config.order,
                            }
                        );
                        const item = response.data.items?.find(i => i.user.name === userName);
                        return {
                            title: config.title,
                            rankingName: config.rankingName,
                            order: config.order,
                            rank: item?.rank ?? null,
                            rankDiff: item?.difference ?? null,
                            value: item?.value ?? null,
                        };
                    } catch {
                        return {
                            title: config.title,
                            rankingName: config.rankingName,
                            order: config.order,
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
            <Suspense fallback={<RankingCardsSkeleton />}>
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
                allProjectRankingConfigs.map(async config => {
                    try {
                        const response = await apis.internal.stats.getProjectRankings(
                            config.rankingName,
                            {
                                term: period,
                                limit: 100,
                                order: config.order,
                            }
                        );
                        const item = response.data.items?.find(i => i.project.name === projectName);
                        return {
                            title: config.title,
                            rankingName: config.rankingName,
                            order: config.order,
                            rank: item?.rank ?? null,
                            rankDiff: item?.difference ?? null,
                            value: item?.value ?? null,
                        };
                    } catch {
                        return {
                            title: config.title,
                            rankingName: config.rankingName,
                            order: config.order,
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
            <Suspense fallback={<RankingCardsSkeleton />}>
                <RankingCardsContent
                    fetcher={fetcher}
                    type="project"
                    name={projectName}
                />
            </Suspense>
        </ErrorBoundary>
    );
};
