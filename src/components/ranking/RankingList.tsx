import { ActionIcon, Group, Paper, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import { PAvatar } from "/@/components/PAvatar";
import { TrendIndicator } from "/@/components/TrendIndicator";
import { toBranded } from "/@/types/entity";
import type { ProjectName, UserName } from "/@/types/entity";

import type { RankedItem, RankingBaseProps, RankingEntity } from "./RankingTypes";
import { isProject } from "./RankingTypes";

export interface RankingListProps<
    T extends RankingEntity = RankingEntity,
> extends RankingBaseProps<T> {
    title?: string;
}

interface RankingListItemProps<T extends RankingEntity = RankingEntity> {
    type: "user" | "project";
    rankedItem: RankedItem<T>;
    onItemClick?: (item: RankedItem<T>) => void;
}

/**
 * リストの個別アイテム
 */
const RankingListItem = <T extends RankingEntity>({
    type,
    rankedItem,
    onItemClick,
}: RankingListItemProps<T>) => {
    const { rank, rankDiff, entity } = rankedItem;
    const entityIsProject = isProject(entity);
    const projectUrl = entityIsProject ? entity.url : undefined;

    const handleExternalLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (projectUrl) {
            window.open(projectUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <Paper
            className="cursor-pointer transition-colors hover:bg-gray-50"
            onClick={() => onItemClick?.(rankedItem)}
            p="sm"
            radius="sm"
            withBorder
        >
            <Group
                gap="md"
                wrap="nowrap"
            >
                {/* 順位 */}
                <Text
                    c="dimmed"
                    className="w-8 text-center"
                    fw={600}
                    size="sm"
                >
                    {rank}
                </Text>

                {/* 順位変動 */}
                {rankDiff !== undefined && (
                    <div className="w-8 flex justify-center">
                        <TrendIndicator diff={rankDiff} />
                    </div>
                )}

                {/* アバター */}
                <PAvatar
                    name={
                        type === "user"
                            ? toBranded<UserName>(entity.name ?? "")
                            : toBranded<ProjectName>(entity.name ?? "")
                    }
                    size="sm"
                    type={type}
                />

                {/* 名前 */}
                <Text
                    className="flex-1"
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
                        <IconExternalLink size={16} />
                    </ActionIcon>
                )}

                {/* ポイント */}
                <Text
                    c="blue"
                    fw={600}
                    size="sm"
                >
                    {entity.balance?.toLocaleString() ?? 0} pt
                </Text>
            </Group>
        </Paper>
    );
};

/**
 * 4位以降を縦リストで表示するコンポーネント
 */
export const RankingList = <T extends RankingEntity>({
    type,
    items,
    title,
    onItemClick,
}: RankingListProps<T>) => {
    if (items.length === 0) {
        return (
            <Text
                c="dimmed"
                ta="center"
            >
                表示するデータがありません
            </Text>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {title && (
                <Text
                    fw={600}
                    mb="xs"
                    size="sm"
                >
                    {title}
                </Text>
            )}
            {items.map(rankedItem => (
                <RankingListItem
                    key={rankedItem.entity.id}
                    onItemClick={onItemClick}
                    rankedItem={rankedItem}
                    type={type}
                />
            ))}
        </div>
    );
};
