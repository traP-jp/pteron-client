import { Suspense, use, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

import { Center, SimpleGrid, Text } from "@mantine/core";

import apis from "/@/api";
import type { Project } from "/@/api/schema/internal";
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
    items: RankedItem<Project>[];
}

const rankingConfigs: { title: string; rankingName: RankingName }[] = [
    { title: "残高ランキング", rankingName: "balance" },
    { title: "取引数ランキング", rankingName: "count" },
    { title: "収入ランキング", rankingName: "in" },
    { title: "支出ランキング", rankingName: "out" },
    { title: "差額ランキング", rankingName: "difference" },
    { title: "総額ランキング", rankingName: "total" },
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

    return (
        <RankingFull
            key={ranking.rankingName}
            items={ranking.items}
            maxItems={5}
            title={ranking.title}
            titleLink={`/stats/projects/${ranking.rankingName}`}
            type="project"
        />
    );
};

const ProjectStats = () => {
    const { period } = useOutletContext<StatsContext>();

    const fetchers = useMemo(
        () =>
            rankingConfigs.map(async config => {
                const {
                    data: { items },
                } = await apis.internal.stats.getProjectRankings(config.rankingName, {
                    term: period,
                    limit: 8,
                });

                return {
                    ...config,
                    items:
                        items?.map(item => ({
                            rank: item.rank,
                            rankDiff: item.difference,
                            entity: item.project,
                        })) ?? [],
                };
            }),
        [period]
    );

    return (
        <SimpleGrid
            cols={{ base: 1, xl: 2 }}
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
export default ProjectStats;
