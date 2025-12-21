import { Link } from "react-router-dom";

import { Card, Group, Stack, Text } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { IconCrown } from "@tabler/icons-react";

import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TrendIndicator } from "/@/components/TrendIndicator";
import { type Copia, toBranded } from "/@/types/entity";
import type { ProjectName, UserName } from "/@/types/entity";

import type { RankedItem, RankingBaseProps, RankingEntity, ValueDisplayType } from "./RankingTypes";

/**
 * 王冠の色とサイズを取得
 */
const getCrownStyle = (rank: number): { color: string; size: number } => {
    switch (rank) {
        case 1:
            return { color: "#FFD700", size: 32 }; // Gold, larger
        case 2:
            return { color: "#C0C0C0", size: 28 }; // Silver
        case 3:
            return { color: "#CD7F32", size: 28 }; // Bronze
        default:
            return { color: "#718096", size: 24 }; // Gray
    }
};

interface RankingTop3ItemProps<T extends RankingEntity = RankingEntity> {
    type: "user" | "project";
    rankedItem: RankedItem<T>;
    onItemClick?: (item: RankedItem<T>) => void;
    valueDisplay?: ValueDisplayType;
    isNarrow?: boolean;
}

/**
 * Top3の個別カード
 * レイアウト: 王冠 → ポイント → アバター+名前
 */
const RankingTop3Item = <T extends RankingEntity>({
    type,
    rankedItem,
    valueDisplay = "copia",
    isNarrow = false,
}: RankingTop3ItemProps<T>) => {
    const { rank, rankDiff, entity } = rankedItem;
    const crownStyle = getCrownStyle(rank);
    const isFirst = rank === 1;
    const detailPath = type === "user" ? `/users/${entity.name}` : `/projects/${entity.name}`;

    return (
        <Card
            component={Link}
            to={detailPath}
            className={`cursor-pointer transition-transform hover:scale-105 ${isFirst ? "border-2 border-yellow-400" : ""}`}
            padding="sm"
            radius="md"
            shadow="sm"
            withBorder
            style={{
                flex: isNarrow ? undefined : 1,
                minWidth: isNarrow ? undefined : 0,
                width: isNarrow ? "100%" : undefined,
                textDecoration: "none",
                color: "inherit",
                overflow: "hidden",
            }}
        >
            <Stack
                align="center"
                gap="xs"
            >
                <Stack
                    align="center"
                    gap={0}
                >
                    {/* 順位変動がある場合のみ表示 */}
                    {rankDiff !== undefined && <TrendIndicator diff={rankDiff} />}

                    {/* 王冠アイコン */}
                    <IconCrown
                        aria-label={`Rank ${rank} crown`}
                        color={crownStyle.color}
                        fill={crownStyle.color}
                        role="img"
                        size={crownStyle.size}
                    />
                </Stack>

                {/* ポイント */}
                {valueDisplay === "copia" ? (
                    <PAmount
                        coloring
                        compact
                        fw={700}
                        leadingIcon
                        size={isFirst ? "md" : "sm"}
                        value={toBranded<Copia>(BigInt(entity.balance ?? 0))}
                    />
                ) : valueDisplay === "percent" ? (
                    <Text
                        c="blue"
                        fw={700}
                        size={isFirst ? "md" : "sm"}
                    >
                        {entity.balance?.toLocaleString() ?? 0}%
                    </Text>
                ) : (
                    <Text
                        c="blue"
                        fw={700}
                        size={isFirst ? "md" : "sm"}
                    >
                        {entity.balance?.toLocaleString() ?? 0}
                    </Text>
                )}

                {/* アバター + 名前 */}
                <Group
                    gap="xs"
                    wrap="nowrap"
                    style={{ maxWidth: "100%", overflow: "hidden" }}
                >
                    <PAvatar
                        name={
                            type === "user"
                                ? toBranded<UserName>(entity.name ?? "")
                                : toBranded<ProjectName>(entity.name ?? "")
                        }
                        size="sm"
                        type={type}
                    />
                    <Text
                        fw={500}
                        size="xs"
                        truncate
                        style={{ flex: 1, minWidth: 0 }}
                    >
                        {entity.name}
                    </Text>
                </Group>
            </Stack>
        </Card>
    );
};

export type RankingTop3Props<T extends RankingEntity = RankingEntity> = RankingBaseProps<T>;

/**
 * 1位〜3位を横並びで表示するコンポーネント
 */
export const RankingTop3 = <T extends RankingEntity>({
    type,
    items,
    onItemClick,
    valueDisplay = "copia",
}: RankingTop3Props<T>) => {
    const { ref, width } = useElementSize();
    // コンテナ幅が480px未満の場合は縦並び
    const isNarrow = width < 480;

    // 狭い場合は順位順 (1位, 2位, 3位 ...)
    // 広い場合は表彰台形式 (2位, 1位, 3位 ...)
    // itemsは既にソートされている前提だが、念のためここでもソートは維持して配置する

    let orderedItems: RankedItem<T>[];

    if (isNarrow) {
        // そのまま表示
        orderedItems = items;
    } else {
        // 表彰台形式への並び替え
        const first = items[0];
        const second = items[1];
        const third = items[2];

        orderedItems = [];
        if (second) orderedItems.push(second);
        if (first) orderedItems.push(first);
        if (third) orderedItems.push(third);
    }

    if (orderedItems.length === 0) {
        return (
            <Text
                c="dimmed"
                ta="center"
            >
                ランキングデータがありません
            </Text>
        );
    }

    if (isNarrow) {
        return (
            <ErrorBoundary>
                <Stack
                    ref={ref}
                    align="center"
                    gap="md"
                >
                    {orderedItems.map(rankedItem => (
                        <RankingTop3Item
                            key={rankedItem.entity.id}
                            isNarrow
                            onItemClick={onItemClick}
                            rankedItem={rankedItem}
                            type={type}
                            valueDisplay={valueDisplay}
                        />
                    ))}
                </Stack>
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <Group
                ref={ref}
                align="end" // 下揃えにして表彰台の高低差を自然に見せる
                gap="md"
                grow
                wrap="nowrap"
            >
                {orderedItems.map(rankedItem => (
                    <RankingTop3Item
                        key={rankedItem.entity.id}
                        onItemClick={onItemClick}
                        rankedItem={rankedItem}
                        type={type}
                        valueDisplay={valueDisplay}
                    />
                ))}
            </Group>
        </ErrorBoundary>
    );
};
