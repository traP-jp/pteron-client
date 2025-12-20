import { Suspense, use } from "react";
import { useOutletContext } from "react-router-dom";

import { Center, Loader, SimpleGrid, Text } from "@mantine/core";

import apis from "/@/api";
import type { User } from "/@/api/schema/internal";
import { RankingFull } from "/@/components/ranking/RankingFull";
import type { RankedItem } from "/@/components/ranking/RankingTypes";

interface StatsContext {
    period: "24hours" | "7days" | "30days" | "365days";
}

type RankingName = "balance" | "difference" | "in" | "out" | "count" | "total" | "ratio";

interface RankingData {
    title: string;
    rankingName: RankingName;
    items: RankedItem<User>[];
}

const rankingConfigs: { title: string; rankingName: RankingName }[] = [
    { title: "残高ランキング", rankingName: "balance" },
    { title: "取引数ランキング", rankingName: "count" },
    { title: "収入ランキング", rankingName: "in" },
    { title: "支出ランキング", rankingName: "out" },
    { title: "差額ランキング", rankingName: "difference" },
    { title: "総額ランキング", rankingName: "total" },
];

const TheUserStats = ({ fetcher }: { fetcher: Promise<RankingData[]> }) => {
    const rankings = use(fetcher);

    if (rankings.every(({ items }) => items.length <= 0)) {
        return (
            <Center py="xl">
                <Text c="dimmed">データの取得に失敗しました</Text>
            </Center>
        );
    }

    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="md"
        >
            {rankings.map(ranking => (
                <RankingFull
                    key={ranking.rankingName}
                    items={ranking.items}
                    maxItems={5}
                    title={ranking.title}
                    titleLink={`/stats/users/${ranking.rankingName}`}
                    type="user"
                />
            ))}
        </SimpleGrid>
    );
};

const UserStats = () => {
    const { period } = useOutletContext<StatsContext>();

    const fetcher = Promise.all(
        rankingConfigs.map(async config => {
            const response = await apis.internal.stats.getUserRankings(config.rankingName, {
                term: period,
                limit: 8,
            });
            const items: RankedItem<User>[] =
                response.data.items?.map(item => ({
                    rank: item.rank,
                    rankDiff: item.difference,
                    entity: item.user,
                })) ?? [];
            return { ...config, items, loading: false };
        })
    );

    return (
        <Suspense
            fallback={
                <Center py="xl">
                    <Loader size="lg" />
                </Center>
            }
        >
            <TheUserStats fetcher={fetcher} />
        </Suspense>
    );
};

export default UserStats;
