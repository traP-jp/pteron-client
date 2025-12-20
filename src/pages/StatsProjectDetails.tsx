import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

import {
    ActionIcon,
    Center,
    Group,
    Loader,
    Pagination,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";

import apis from "/@/api";
import type { Project } from "/@/api/schema/internal";
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

const StatsProjectDetails = () => {
    const { rankingName } = useParams<{ rankingName: string }>();
    const { period } = useOutletContext<StatsContext>();

    const [items, setItems] = useState<RankedItem<Project>[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
    const [currentPage, setCurrentPage] = useState(1);

    // ランキング名のバリデーション
    const validRankingName = (rankingName as RankingName) || "balance";
    const title = rankingTitles[validRankingName] || "ランキング";

    useEffect(() => {
        const fetchRanking = async () => {
            setLoading(true);
            try {
                const response = await apis.internal.stats.getProjectRankings(validRankingName, {
                    term: period,
                    limit: 100, // 全件取得（クライアントサイドフィルタ用）
                });
                const rankedItems: RankedItem<Project>[] =
                    response.data.items?.map(item => ({
                        rank: item.rank,
                        rankDiff: item.difference,
                        entity: item.project,
                    })) ?? [];
                setItems(rankedItems);
            } catch (error) {
                console.error("Failed to fetch ranking:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
        setCurrentPage(1);
    }, [validRankingName, period]);

    // 検索でページをリセット
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedQuery]);

    // フィルタリング
    const filteredItems = debouncedQuery
        ? items.filter(item =>
              item.entity.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
        : items;

    // ページネーション計算
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // 表示用にrankを再計算
    const displayItems: RankedItem<Project>[] = paginatedItems.map((item, index) => ({
        ...item,
        rank: startIndex + index + 1,
    }));

    if (loading) {
        return (
            <Center py="xl">
                <Loader size="lg" />
            </Center>
        );
    }

    return (
        <Stack gap="md">
            {/* ヘッダー */}
            <Group gap="md">
                <ActionIcon
                    component={Link}
                    size="lg"
                    to="/stats/projects"
                    variant="subtle"
                >
                    <IconArrowLeft size={20} />
                </ActionIcon>
                <Title order={3}>{title}</Title>
            </Group>

            {/* 検索 */}
            <TextInput
                leftSection={<IconSearch size={16} />}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="プロジェクト名で検索..."
                value={searchQuery}
            />

            {/* ランキング表示 */}
            {filteredItems.length === 0 ? (
                <Center py="xl">
                    <Text c="dimmed">
                        {debouncedQuery ? "検索結果がありません" : "データがありません"}
                    </Text>
                </Center>
            ) : (
                <>
                    <RankingFull
                        items={displayItems}
                        maxItems={ITEMS_PER_PAGE}
                        showTop3={currentPage === 1 && !debouncedQuery}
                        type="project"
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

export default StatsProjectDetails;
