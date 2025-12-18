import { Divider, Paper, Stack, Text } from "@mantine/core";

import { RankingList } from "./RankingList";
import { RankingTop3 } from "./RankingTop3";
import type { RankedUser, RankingBaseProps } from "./RankingTypes";

export interface RankingFullProps extends RankingBaseProps {
    title?: string;
    showTop3?: boolean;
    maxItems?: number;
}

/**
 * 全体ランキング表示コンポーネント
 * 3位まで（横並び）+ 4位以降（縦リスト）を組み合わせて表示
 */
export const RankingFull = ({
    users,
    title,
    showTop3 = true,
    maxItems = 20,
    onUserClick,
}: RankingFullProps) => {
    // 最大件数でフィルタ
    const limitedUsers = users.slice(0, maxItems);

    // 3位までとそれ以降を分割
    const top3Users: RankedUser[] = showTop3 ? limitedUsers.filter(u => u.rank <= 3) : [];
    const restUsers: RankedUser[] = showTop3 ? limitedUsers.filter(u => u.rank > 3) : limitedUsers;

    if (limitedUsers.length === 0) {
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
            <Stack gap="md">
                {title && (
                    <Text
                        fw={700}
                        size="lg"
                    >
                        {title}
                    </Text>
                )}

                {/* 3位まで */}
                {showTop3 && top3Users.length > 0 && (
                    <>
                        <RankingTop3
                            onUserClick={onUserClick}
                            users={top3Users}
                        />
                        {restUsers.length > 0 && <Divider my="sm" />}
                    </>
                )}

                {/* 4位以降 */}
                {restUsers.length > 0 && (
                    <RankingList
                        onUserClick={onUserClick}
                        users={restUsers}
                    />
                )}
            </Stack>
        </Paper>
    );
};
