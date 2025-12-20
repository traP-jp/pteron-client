import { ActionIcon, Card, Group, Stack, Text } from "@mantine/core";
import { IconCrown, IconExternalLink } from "@tabler/icons-react";

import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TrendIndicator } from "/@/components/TrendIndicator";
import { type Copia, type Url, toBranded } from "/@/types/entity";
import type { ProjectName, UserName } from "/@/types/entity";

import type { RankedItem, RankingBaseProps, RankingEntity, ValueDisplayType } from "./RankingTypes";
import { isProject } from "./RankingTypes";

import { createExternalLinkHander } from "../lib/link";

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
}

/**
 * Top3の個別カード
 * レイアウト: 王冠 → ポイント → アバター+名前
 */
const RankingTop3Item = <T extends RankingEntity>({
    type,
    rankedItem,
    onItemClick,
    valueDisplay = "copia",
}: RankingTop3ItemProps<T>) => {
    const { rank, rankDiff, entity } = rankedItem;
    const crownStyle = getCrownStyle(rank);
    const isFirst = rank === 1;
    const entityIsProject = isProject(entity);
    const projectUrl = toBranded<Url>(entityIsProject ? (entity.url ?? "") : "");

    const handleExternalLinkClick = createExternalLinkHander(projectUrl);

    return (
        <Card
            className={`flex-1 cursor-pointer transition-transform hover:scale-105 ${isFirst ? "border-2 border-yellow-400" : ""}`}
            onClick={() => onItemClick?.(rankedItem)}
            padding="md"
            radius="md"
            shadow="sm"
            withBorder
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
                        c="blue"
                        fw={700}
                        leadingIcon
                        size={isFirst ? "xl" : "lg"}
                        value={toBranded<Copia>(entity.balance ?? 0)}
                    />
                ) : valueDisplay === "percent" ? (
                    <Text
                        c="blue"
                        fw={700}
                        size={isFirst ? "xl" : "lg"}
                    >
                        {entity.balance?.toLocaleString() ?? 0}%
                    </Text>
                ) : (
                    <Text
                        c="blue"
                        fw={700}
                        size={isFirst ? "xl" : "lg"}
                    >
                        {entity.balance?.toLocaleString() ?? 0}
                    </Text>
                )}

                {/* アバター + 名前 + 外部リンク */}
                <Group
                    gap="xs"
                    wrap="nowrap"
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
                        lineClamp={1}
                        size="sm"
                    >
                        {entity.name}
                    </Text>
                    {/* プロジェクトの場合のみ外部リンクアイコン */}
                    {type === "project" && projectUrl && (
                        <ActionIcon
                            aria-label="サイトを開く"
                            color="gray"
                            onClick={handleExternalLinkClick}
                            size="sm"
                            variant="subtle"
                        >
                            <IconExternalLink size={14} />
                        </ActionIcon>
                    )}
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
    // 1位〜3位のみ取得
    const top3Items = items.filter(u => u.rank >= 1 && u.rank <= 3);

    // 表彰台形式の並び順にする (2位, 1位, 3位)
    // データが足りない場合も考慮して、rankで検索して配置
    const podiumItems = [
        top3Items.find(u => u.rank === 2),
        top3Items.find(u => u.rank === 1),
        top3Items.find(u => u.rank === 3),
    ].filter(u => u !== undefined) as RankedItem<T>[];

    if (podiumItems.length === 0) {
        return (
            <Text
                c="dimmed"
                ta="center"
            >
                ランキングデータがありません
            </Text>
        );
    }

    return (
        <Group
            align="end" // 下揃えにして表彰台の高低差を自然に見せる
            gap="md"
            grow
        >
            {podiumItems.map(rankedItem => (
                <RankingTop3Item
                    key={rankedItem.entity.id}
                    onItemClick={onItemClick}
                    rankedItem={rankedItem}
                    type={type}
                    valueDisplay={valueDisplay}
                />
            ))}
        </Group>
    );
};
