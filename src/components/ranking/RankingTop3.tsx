import { Card, Group, Stack, Text } from "@mantine/core";
import { IconCrown } from "@tabler/icons-react";

import { PAvater } from "/@/components/PAvatar";
import { TrendIndicator } from "/@/components/TrendIndicator";
import { toBranded } from "/@/types/entity";
import type { UserName } from "/@/types/entity";

import type { RankedUser, RankingBaseProps } from "./RankingTypes";

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

interface RankingTop3ItemProps {
    rankedUser: RankedUser;
    onUserClick?: (user: RankedUser) => void;
}

/**
 * Top3の個別カード
 * レイアウト: 王冠 → ポイント → アバター+ユーザー名
 */
const RankingTop3Item = ({ rankedUser, onUserClick }: RankingTop3ItemProps) => {
    const { rank, rankDiff, user } = rankedUser;
    const crownStyle = getCrownStyle(rank);
    const isFirst = rank === 1;

    return (
        <Card
            className={`flex-1 cursor-pointer transition-transform hover:scale-105 ${isFirst ? "border-2 border-yellow-400" : ""}`}
            onClick={() => onUserClick?.(rankedUser)}
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
                        color={crownStyle.color}
                        fill={crownStyle.color}
                        size={crownStyle.size}
                    />
                </Stack>

                {/* ポイント */}
                <Text
                    c="blue"
                    fw={700}
                    size={isFirst ? "xl" : "lg"}
                >
                    {user.balance?.toLocaleString() ?? 0}
                </Text>

                {/* アバター + ユーザー名 */}
                <Group
                    gap="xs"
                    wrap="nowrap"
                >
                    <PAvater
                        name={toBranded<UserName>(user.name ?? "")}
                        size="sm"
                        type="user"
                    />
                    <Text
                        fw={500}
                        lineClamp={1}
                        size="sm"
                    >
                        {user.name}
                    </Text>
                </Group>
            </Stack>
        </Card>
    );
};

export type RankingTop3Props = RankingBaseProps;

/**
 * 1位〜3位を横並びで表示するコンポーネント
 */
export const RankingTop3 = ({ users, onUserClick }: RankingTop3Props) => {
    // 1位〜3位のみ取得
    const top3Users = users.filter(u => u.rank >= 1 && u.rank <= 3);

    // 表彰台形式の並び順にする (2位, 1位, 3位)
    // データが足りない場合も考慮して、rankで検索して配置
    const podiumUsers = [
        top3Users.find(u => u.rank === 2),
        top3Users.find(u => u.rank === 1),
        top3Users.find(u => u.rank === 3),
    ].filter(u => u !== undefined) as RankedUser[];

    if (podiumUsers.length === 0) {
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
            {podiumUsers.map(rankedUser => (
                <RankingTop3Item
                    key={rankedUser.user.id}
                    onUserClick={onUserClick}
                    rankedUser={rankedUser}
                />
            ))}
        </Group>
    );
};
