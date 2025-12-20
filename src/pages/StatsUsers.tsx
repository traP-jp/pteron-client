import { useOutletContext } from "react-router-dom";

import { SimpleGrid } from "@mantine/core";

import { RankingFull } from "/@/components/ranking/RankingFull";
import type { RankedItem } from "/@/components/ranking/RankingTypes";
import type { User } from "/@/components/ranking/RankingTypes";

interface StatsContext {
    period: string;
}

// モックデータ（デバッグ用）
const mockUserItems: RankedItem<User>[] = [
    { rank: 1, rankDiff: 1, entity: { id: "1", name: "alice", balance: 15000 } },
    { rank: 2, rankDiff: -1, entity: { id: "2", name: "bob", balance: 12500 } },
    { rank: 3, rankDiff: 0, entity: { id: "3", name: "charlie", balance: 10000 } },
    { rank: 4, rankDiff: 2, entity: { id: "4", name: "david", balance: 8500 } },
    { rank: 5, rankDiff: 0, entity: { id: "5", name: "eve", balance: 7200 } },
    { rank: 6, rankDiff: -3, entity: { id: "6", name: "frank", balance: 6800 } },
    { rank: 7, rankDiff: 0, entity: { id: "7", name: "grace", balance: 5500 } },
    { rank: 8, rankDiff: 5, entity: { id: "8", name: "henry", balance: 4200 } },
];

const StatsUsers = () => {
    const { period } = useOutletContext<StatsContext>();
    console.log("Current period:", period); // デバッグ用

    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="md"
        >
            <RankingFull
                items={mockUserItems}
                maxItems={5}
                title="残高ランキング"
                type="user"
            />
            <RankingFull
                items={mockUserItems}
                maxItems={5}
                title="取引数ランキング"
                type="user"
            />
            <RankingFull
                items={mockUserItems}
                maxItems={5}
                title="収入ランキング"
                type="user"
            />
            <RankingFull
                items={mockUserItems}
                maxItems={5}
                title="支出ランキング"
                type="user"
            />
            <RankingFull
                items={mockUserItems}
                maxItems={5}
                title="差額ランキング"
                type="user"
            />
            <RankingFull
                items={mockUserItems}
                maxItems={5}
                title="総額ランキング"
                type="user"
            />
        </SimpleGrid>
    );
};

export default StatsUsers;
