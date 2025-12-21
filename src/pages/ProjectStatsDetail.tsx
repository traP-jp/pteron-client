import { Suspense, use, useEffect, useMemo } from "react";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";

import { Button, Center, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

import apis from "/@/api";
import type { Project } from "/@/api/schema/internal";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { RankingFull } from "/@/components/ranking/RankingFull";
import type { RankedItem } from "/@/components/ranking/RankingTypes";
import { RankingCardSkeleton } from "/@/components/skeletons/PageSkeletons";

interface StatsContext {
    period: "24hours" | "7days" | "30days" | "365days";
}

type RankingName = "balance" | "difference" | "in" | "out" | "count" | "total";

const rankingTitles: Record<RankingName, string> = {
    balance: "残高ランキング",
    difference: "残高変動ランキング",
    in: "収入ランキング",
    out: "支出ランキング",
    count: "取引数ランキング",
    total: "取引総額ランキング",
};

interface RankingContentProps {
    fetcher: Promise<RankedItem<Project>[]>;
}

const RankingContent = ({ fetcher }: RankingContentProps) => {
    const items = use(fetcher);

    if (items.length === 0) {
        return (
            <Center py="xl">
                <Text c="dimmed">データがありません</Text>
            </Center>
        );
    }

    return (
        <RankingFull
            type="project"
            items={items}
            showTop3
            maxItems={100}
        />
    );
};

const ProjectStatsDetail = () => {
    const { period } = useOutletContext<StatsContext>();
    const { rankingName } = useParams<{ rankingName: RankingName }>();
    const [searchParams, setSearchParams] = useSearchParams();

    const order = (searchParams.get("order") as "asc" | "desc") || "desc";

    // パラメータなしでアクセスした場合はdescを設定
    useEffect(() => {
        if (!searchParams.has("order")) {
            setSearchParams({ order: "desc" }, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const fetcher = useMemo(() => {
        if (!rankingName || !(rankingName in rankingTitles)) {
            return Promise.resolve([]);
        }

        return apis.internal.stats
            .getProjectRankings(rankingName, {
                term: period,
                limit: 100,
                order,
            })
            .then(
                ({ data }) =>
                    data.items?.map(item => ({
                        rank: item.rank,
                        rankDiff: item.difference,
                        entity: item.project,
                    })) ?? []
            );
    }, [rankingName, period, order]);

    const baseTitle = rankingName
        ? (rankingTitles[rankingName as RankingName] ?? "ランキング")
        : "ランキング";

    const orderSuffix = order === "desc" ? " (トップ)" : " (ワースト)";
    const title = baseTitle + orderSuffix;

    const toggleOrder = () => {
        const newOrder = order === "desc" ? "asc" : "desc";
        setSearchParams({ order: newOrder }, { replace: true });
    };

    // Suspenseを強制的にリセットするためのkey
    const suspenseKey = `${rankingName}-${period}-${order}`;

    return (
        <Stack gap="md">
            <Group
                justify="space-between"
                align="center"
            >
                <Title
                    order={2}
                    size="h3"
                >
                    {title}
                </Title>
                <Button
                    variant="light"
                    leftSection={
                        order === "desc" ? <IconArrowDown size={16} /> : <IconArrowUp size={16} />
                    }
                    onClick={toggleOrder}
                >
                    {order === "desc" ? "降順で表示中" : "昇順で表示中"}
                </Button>
            </Group>

            <ErrorBoundary>
                <Suspense
                    key={suspenseKey}
                    fallback={<RankingCardSkeleton />}
                >
                    <RankingContent fetcher={fetcher} />
                </Suspense>
            </ErrorBoundary>
        </Stack>
    );
};

export default ProjectStatsDetail;
