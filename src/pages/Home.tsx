import { Divider, Stack, Title } from "@mantine/core";

import type { components } from "/@/api/schema/internal";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TransactionList } from "/@/components/TransactionList";
import { TrendIndicator } from "/@/components/TrendIndicator";
import type { RankedUser } from "/@/components/ranking";
import { RankingFull } from "/@/components/ranking";
import { type Copia, type ProjectName, type UserName, toBranded } from "/@/types/entity";

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

type Transaction = components["schemas"]["Transaction"];

const mockTransactions: Transaction[] = [
    {
        id: "1a2b3c4d-5e6f-7890-abcd-ef1234567890",
        type: "TRANSFER",
        amount: 10000,
        project_id: "aabbccdd-eeff-1122-3344-556677889900",
        user_id: "11223344-5566-7788-99aa-bbccddeeff00",
        description: "プロジェクトからの報酬",
        created_at: "2025-12-18T10:00:00Z",
    },
    {
        id: "2b3c4d5e-6f7a-8901-bcde-f12345678901",
        type: "BILL_PAYMENT",
        amount: 5000,
        project_id: "bbccddee-ff11-2233-4455-667788990011",
        user_id: "11223344-5566-7788-99aa-bbccddeeff00",
        description: "サービス利用料",
        created_at: "2025-12-17T15:30:00Z",
    },
    {
        id: "3c4d5e6f-7a8b-9012-cdef-123456789012",
        type: "TRANSFER",
        amount: 25000,
        project_id: "aabbccdd-eeff-1122-3344-556677889900",
        user_id: "11223344-5566-7788-99aa-bbccddeeff00",
        description: "ボーナス",
        created_at: "2025-12-16T09:00:00Z",
    },
    {
        id: "4d5e6f7a-8b9c-0123-def1-234567890123",
        type: "BILL_PAYMENT",
        amount: 3000,
        project_id: "ccddeeff-1122-3344-5566-778899001122",
        user_id: "11223344-5566-7788-99aa-bbccddeeff00",
        description: "月額料金",
        created_at: "2025-12-15T12:00:00Z",
    },
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

            <Divider my="lg" />

            <Stack gap="xs">
                <Title order={3}>PAmount</Title>
                <PAmount
                    value={toBranded<Copia>(100000000n)}
                    coloring
                    size="custom"
                    customSize={5}
                    leadingIcon
                    trailingDash
                />
                <PAmount
                    value={toBranded<Copia>(-100000000n)}
                    coloring
                    size="xl"
                    formatOptions={{
                        useGrouping: false,
                    }}
                />
            </Stack>

            <Divider my="lg" />

            {/* 取引履歴コンポーネント */}
            <Title order={2}>取引履歴</Title>
            <TransactionList
                transactions={mockTransactions}
                currentType="user"
                direction="auto"
            />
        </Stack>
    );
};

export default Home;
