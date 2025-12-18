import { Divider, Stack, Title } from "@mantine/core";

import { PAvatar } from "/@/components/PAvatar";
import { TrendIndicator } from "/@/components/TrendIndicator";
import type { RankedUser } from "/@/components/ranking";
import { RankingFull } from "/@/components/ranking";
import { toBranded } from "/@/types/entity";
import type { ProjectName, UserName } from "/@/types/entity";

// モックデータ（デバッグ用）
const mockUsers: RankedUser[] = [
    { rank: 1, rankDiff: 1, user: { id: "1", name: "alice", balance: 15000 } },
    { rank: 2, rankDiff: -1, user: { id: "2", name: "bob", balance: 12500 } },
    { rank: 3, rankDiff: -1, user: { id: "3", name: "charlie", balance: 10000 } },
    { rank: 4, rankDiff: 2, user: { id: "4", name: "david", balance: 8500 } },
    { rank: 5, rankDiff: 0, user: { id: "5", name: "eve", balance: 7200 } },
    { rank: 6, rankDiff: -3, user: { id: "6", name: "frank", balance: 6800 } },
    { rank: 7, rankDiff: 0, user: { id: "7", name: "grace", balance: 5500 } },
    { rank: 8, rankDiff: 5, user: { id: "8", name: "henry", balance: 4200 } },
    { rank: 9, rankDiff: -1, user: { id: "9", name: "ivy", balance: 3800 } },
    { rank: 10, rankDiff: -2, user: { id: "10", name: "jack", balance: 3000 } },
    { rank: 11, rankDiff: -1, user: { id: "11", name: "karen", balance: 2500 } },
    { rank: 12, rankDiff: -1, user: { id: "12", name: "leo", balance: 2000 } },
    { rank: 13, rankDiff: -1, user: { id: "13", name: "mia", balance: 1800 } },
    { rank: 14, rankDiff: -1, user: { id: "14", name: "nick", balance: 1500 } },
    { rank: 15, rankDiff: -1, user: { id: "15", name: "olivia", balance: 1200 } },
    { rank: 16, rankDiff: -1, user: { id: "16", name: "paul", balance: 1000 } },
    { rank: 17, rankDiff: -1, user: { id: "17", name: "quinn", balance: 800 } },
    { rank: 18, rankDiff: 0, user: { id: "18", name: "rachel", balance: 600 } },
    { rank: 19, rankDiff: -1, user: { id: "19", name: "steve", balance: 400 } },
    { rank: 20, rankDiff: -1, user: { id: "20", name: "tina", balance: 200 } },
];

export const Home = () => {
    const handleUserClick = (rankedUser: RankedUser) => {
        console.log("Clicked user:", rankedUser);
    };

    return (
        <Stack
            gap="xl"
            p="md"
        >
            <Title order={1}>Home</Title>

            {/* 既存のデバッグ用コンポーネント */}
            <Stack gap="xs">
                <Title order={3}>TrendIndicator</Title>
                <TrendIndicator diff={0} />
                <TrendIndicator diff={100} />
                <TrendIndicator diff={-100} />
            </Stack>

            <Stack gap="xs">
                <Title order={3}>PAvatar</Title>
                <div className="flex gap-2">
                    <PAvatar
                        name={toBranded<UserName>("uni_kakurenbo")}
                        type="user"
                    />
                    <PAvatar
                        name={toBranded<ProjectName>("awesome_project")}
                        type="project"
                    />
                </div>
            </Stack>

            <Divider my="lg" />

            {/* ランキングコンポーネント */}
            <Title order={2}>ランキング</Title>

            {/* RankingFull: 全体表示（Top3 + リスト） */}
            <RankingFull
                maxItems={20}
                onUserClick={handleUserClick}
                title="ポイントランキング"
                users={mockUsers}
            />
        </Stack>
    );
};

export default Home;
