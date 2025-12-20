import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { Center, Loader, SimpleGrid, Text } from "@mantine/core";

import apis from "/@/api";
import type { Project } from "/@/api/schema/internal";
import { RankingFull } from "/@/components/ranking/RankingFull";
import type { RankedItem } from "/@/components/ranking/RankingTypes";

interface StatsContext {
    period: "24hours" | "7days" | "30days" | "365days";
}

type RankingName = "balance" | "difference" | "in" | "out" | "count" | "total" | "ratio";

interface RankingData {
    title: string;
    rankingName: RankingName;
    items: RankedItem<Project>[];
    loading: boolean;
}

const rankingConfigs: { title: string; rankingName: RankingName }[] = [
    { title: "残高ランキング", rankingName: "balance" },
    { title: "取引数ランキング", rankingName: "count" },
    { title: "収入ランキング", rankingName: "in" },
    { title: "支出ランキング", rankingName: "out" },
    { title: "差額ランキング", rankingName: "difference" },
    { title: "総額ランキング", rankingName: "total" },
];

const StatsProjects = () => {
    const { period } = useOutletContext<StatsContext>();
    const [rankings, setRankings] = useState<RankingData[]>(
        rankingConfigs.map(config => ({
            ...config,
            items: [],
            loading: true,
        }))
    );

    useEffect(() => {
        const fetchRankings = async () => {
            // 全てのランキングをロード中に設定
            setRankings(prev => prev.map(r => ({ ...r, loading: true })));

            const results = await Promise.all(
                rankingConfigs.map(async config => {
                    try {
                        const response = await apis.internal.stats.getProjectRankings(
                            config.rankingName,
                            { term: period, limit: 8 }
                        );
                        const items: RankedItem<Project>[] =
                            response.data.items?.map(item => ({
                                rank: item.rank,
                                rankDiff: item.difference,
                                entity: item.project,
                            })) ?? [];
                        return { ...config, items, loading: false };
                    } catch (error) {
                        console.error(`Failed to fetch ${config.rankingName} ranking:`, error);
                        return { ...config, items: [], loading: false };
                    }
                })
            );

            setRankings(results);
        };

        fetchRankings();
    }, [period]);

    const isLoading = rankings.some(r => r.loading);

    if (isLoading) {
        return (
            <Center py="xl">
                <Loader size="lg" />
            </Center>
        );
    }

    const hasAnyData = rankings.some(r => r.items.length > 0);

    if (!hasAnyData) {
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
                    type="project"
                />
            ))}
        </SimpleGrid>
    );
};

export default StatsProjects;
