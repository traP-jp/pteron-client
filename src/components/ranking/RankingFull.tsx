import { Link } from "react-router-dom";

import { Anchor, Paper, Stack, Text } from "@mantine/core";

import ErrorBoundary from "/@/components/ErrorBoundary";

import { RankingList } from "./RankingList";
import { RankingTop3 } from "./RankingTop3";
import type { RankedItem, RankingBaseProps, RankingEntity } from "./RankingTypes";

export interface RankingFullProps<
    T extends RankingEntity = RankingEntity,
> extends RankingBaseProps<T> {
    title?: string;
    /** タイトルのリンク先URL */
    titleLink?: string;
    showTop3?: boolean;
    maxItems?: number;
}

/**
 * 全体ランキング表示コンポーネント
 * 3位まで（横並び）+ 4位以降（縦リスト）を組み合わせて表示
 */
export const RankingFull = <T extends RankingEntity>({
    type,
    items,
    title,
    titleLink,
    showTop3 = true,
    maxItems = 20,
    onItemClick,
    valueDisplay = "copia",
}: RankingFullProps<T>) => {
    // ランク順にソート (APIがソートされていない可能性を考慮)
    const sortedItems = [...items].sort((a, b) => a.rank - b.rank);
    // 最大件数で制限
    const limitedItems = sortedItems.slice(0, maxItems);

    // 3位までとそれ以降を分割 (ランク値ではなく、ソート後の順序で決定)
    const top3Items: RankedItem<T>[] = showTop3 ? limitedItems.slice(0, 3) : [];
    const restItems: RankedItem<T>[] = showTop3 ? limitedItems.slice(3) : limitedItems;

    if (limitedItems.length === 0) {
        return (
            <Paper
                p="lg"
                radius="md"
                withBorder
            >
                <Text
                    c="dimmed"
                    ta="center"
                >
                    ランキングデータがありません
                </Text>
            </Paper>
        );
    }

    return (
        <Paper
            p="lg"
            radius="md"
            withBorder
        >
            <ErrorBoundary>
                <Stack gap="md">
                    {title &&
                        (titleLink ? (
                            <Anchor
                                component={Link}
                                fw={700}
                                size="lg"
                                to={titleLink}
                                underline="hover"
                            >
                                {title}
                            </Anchor>
                        ) : (
                            <Text
                                fw={700}
                                size="lg"
                            >
                                {title}
                            </Text>
                        ))}

                    {/* 3位まで */}
                    {showTop3 && top3Items.length > 0 && (
                        <RankingTop3
                            items={top3Items}
                            onItemClick={onItemClick}
                            type={type}
                            valueDisplay={valueDisplay}
                        />
                    )}

                    {/* 4位以降 */}
                    {restItems.length > 0 && (
                        <RankingList
                            items={restItems}
                            onItemClick={onItemClick}
                            type={type}
                            valueDisplay={valueDisplay}
                        />
                    )}
                </Stack>
            </ErrorBoundary>
        </Paper>
    );
};
