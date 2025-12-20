import { Suspense, use, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

import { ActionIcon, Center, Group, Loader, Pagination, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import apis from "/@/api";
import type { User } from "/@/api/schema/internal";
import { RankingFull } from "/@/components/ranking/RankingFull";
import type { RankedItem } from "/@/components/ranking/RankingTypes";

interface StatsContext {
    period: "24hours" | "7days" | "30days" | "365days";
}

type RankingName = "balance" | "difference" | "in" | "out" | "count" | "total" | "ratio";

const rankingTitles: Record<RankingName, string> = {
    balance: "残高ランキング",
    difference: "差額ランキング",
    in: "収入ランキング",
    out: "支出ランキング",
    count: "取引数ランキング",
    total: "総額ランキング",
    ratio: "比率ランキング",
};

const ITEMS_PER_PAGE = 20;

const TheUserStatsDetail = ({
    title,
    fetcher,
}: {
    title: string;
    fetcher: Promise<RankedItem<User>[]>;
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const items: RankedItem<User>[] = use(fetcher);

    // ページネーション計算
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // 表示用にrankを再計算
    const displayItems: RankedItem<User>[] = paginatedItems.map((item, index) => ({
        ...item,
        rank: startIndex + index + 1,
    }));

    return (
        <Stack gap="md">
            {/* ヘッダー */}
            <Group gap="md">
                <ActionIcon
                    component={Link}
                    size="lg"
                    to="/stats/users"
                    variant="subtle"
                >
                    <IconArrowLeft size={20} />
                </ActionIcon>
                <Title order={3}>{title}</Title>
            </Group>

            {/* ランキング表示 */}
            {items.length === 0 ? (
                <Center py="xl">
                    <Text c="dimmed">データがありません</Text>
                </Center>
            ) : (
                <>
                    <RankingFull
                        items={displayItems}
                        maxItems={ITEMS_PER_PAGE}
                        showTop3={currentPage === 1}
                        type="user"
                    />

                    {/* ページネーション */}
                    {totalPages > 1 && (
                        <Center>
                            <Pagination
                                onChange={setCurrentPage}
                                total={totalPages}
                                value={currentPage}
                            />
                        </Center>
                    )}
                </>
            )}
        </Stack>
    );
};

const UserStatsDetail = () => {
    const { rankingName } = useParams<{ rankingName: string }>();
    const { period } = useOutletContext<StatsContext>();

    // ランキング名のバリデーション
    const validRankingName = (rankingName as RankingName) || "balance";
    const title = rankingTitles[validRankingName] || "ランキング";

    const fetch = async () => {
        const {
            data: { items },
        } = await apis.internal.stats.getUserRankings(validRankingName, {
            term: period,
            limit: 100,
        });

        return (
            items?.map(item => ({
                rank: item.rank,
                rankDiff: item.difference,
                entity: item.user,
            })) ?? []
        );
    };

    return (
        <Suspense
            fallback={
                <Center py="xl">
                    <Loader size="lg" />
                </Center>
            }
        >
            <TheUserStatsDetail
                title={title}
                fetcher={fetch()}
            />
        </Suspense>
    );
};

export default UserStatsDetail;
