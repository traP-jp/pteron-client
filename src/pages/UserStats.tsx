import { Suspense, use, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

import { Center, SimpleGrid, Text } from "@mantine/core";

import apis from "/@/api";
import type { User } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { RankingFull } from "/@/components/ranking/RankingFull";
import type { RankedItem } from "/@/components/ranking/RankingTypes";
import { RankingCardSkeleton } from "/@/components/skeletons/PageSkeletons";

interface StatsContext {
    period: "24hours" | "7days" | "30days" | "365days";
}

type RankingName = "balance" | "difference" | "in" | "out" | "count" | "total" | "ratio";

interface RankingData {
    title: string;
    rankingName: RankingName;
    items: RankedItem<User>[];
}

const rankingConfigs: { title: string; rankingName: RankingName; order?: "asc" | "desc" }[] = [
    { title: "残高変動トップ", rankingName: "difference", order: "desc" },
    { title: "残高変動ワースト", rankingName: "difference", order: "asc" },
    { title: "残高トップ", rankingName: "balance", order: "desc" },
    { title: "残高ワースト", rankingName: "balance", order: "asc" },
    { title: "取引総額トップ", rankingName: "total", order: "desc" },
    { title: "支出トップ", rankingName: "out", order: "desc" },
];

const TheRanking = ({ fetcher }: { fetcher: Promise<RankingData> }) => {
    const ranking = use(fetcher);

    if (ranking.items.length <= 0) {
        return (
            <Center py="xl">
                <Text c="dimmed">データの取得に失敗しました</Text>
            </Center>
        );
    }

    const titleLink = `/stats/users/${ranking.rankingName}${ranking.order ? `?order=${ranking.order}` : ""}`;

    return (
        <RankingFull
            key={`${ranking.rankingName}-${ranking.order}`}
            items={ranking.items}
            maxItems={5}
            title={ranking.title}
            titleLink={titleLink}
            type="user"
        />
    );
};

const UserStats = () => {
    const { period } = useOutletContext<StatsContext>();

    const fetchers = useMemo(
        () =>
            rankingConfigs.map(async config => {
                const {
                    data: { items },
                } = await apis.internal.stats.getUserRankings(config.rankingName, {
                    term: period,
                    limit: 5,
                    order: config.order,
                });

                return {
                    ...config,
                    items:
                        items?.map(item => ({
                            rank: item.rank,
                            rankDiff: item.difference,
                            entity: item.user,
                        })) ?? [],
                };
            }),
        [period]
    );

    return (
        <SimpleGrid
            cols={{ base: 1, md: 2, lg: 3 }}
            spacing="xs"
        >
            {fetchers.map((fetcher, index) => (
                <ErrorBoundary key={index}>
                    <Suspense fallback={<RankingCardSkeleton />}>
                        <TheRanking fetcher={fetcher} />
                    </Suspense>
                </ErrorBoundary>
            ))}
        </SimpleGrid>
    );
};

export default UserStats;
