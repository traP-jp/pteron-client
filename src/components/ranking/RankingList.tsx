import { Group, Paper, Text } from "@mantine/core";

import { PAvater } from "/@/components/PAvatar";
import { TrendIndicator } from "/@/components/TrendIndicator";
import { toBranded } from "/@/types/entity";
import type { UserName } from "/@/types/entity";

import type { RankedUser, RankingBaseProps } from "./RankingTypes";

export interface RankingListProps extends RankingBaseProps {
    title?: string;
}

interface RankingListItemProps {
    rankedUser: RankedUser;
    onUserClick?: (user: RankedUser) => void;
}

/**
 * リストの個別アイテム
 */
const RankingListItem = ({ rankedUser, onUserClick }: RankingListItemProps) => {
    const { rank, rankDiff, user } = rankedUser;

    return (
        <Paper
            className="cursor-pointer transition-colors hover:bg-gray-50"
            onClick={() => onUserClick?.(rankedUser)}
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
                <PAvater
                    name={toBranded<UserName>(user.name ?? "")}
                    size="sm"
                    type="user"
                />

                {/* ユーザー名 */}
                <Text
                    className="flex-1"
                    fw={500}
                    lineClamp={1}
                    size="sm"
                >
                    {user.name}
                </Text>

                {/* ポイント */}
                <Text
                    c="blue"
                    fw={600}
                    size="sm"
                >
                    {user.balance?.toLocaleString() ?? 0} pt
                </Text>
            </Group>
        </Paper>
    );
};

/**
 * 4位以降を縦リストで表示するコンポーネント
 */
export const RankingList = ({ users, title, onUserClick }: RankingListProps) => {
    if (users.length === 0) {
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
            {users.map(rankedUser => (
                <RankingListItem
                    key={rankedUser.user.id}
                    onUserClick={onUserClick}
                    rankedUser={rankedUser}
                />
            ))}
        </div>
    );
};
