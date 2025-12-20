import { useOutletContext } from "react-router-dom";

import { SimpleGrid } from "@mantine/core";

import { RankingFull } from "/@/components/ranking/RankingFull";
import type { RankedItem } from "/@/components/ranking/RankingTypes";
import type { Project, User } from "/@/components/ranking/RankingTypes";

interface StatsContext {
    period: string;
}

const mockUser1: User = { id: "u1", name: "alice", balance: 15000 };
const mockUser2: User = { id: "u2", name: "bob", balance: 12500 };

const mockProjectItems: RankedItem<Project>[] = [
    {
        rank: 1,
        rankDiff: 2,
        entity: {
            id: "p1",
            name: "traQ",
            balance: 50000,
            url: "https://q.trap.jp",
            admins: [mockUser2],
            owner: mockUser1,
        },
    },
    {
        rank: 2,
        rankDiff: -1,
        entity: {
            id: "p2",
            name: "knoQ",
            balance: 35000,
            url: "https://knoq.trap.jp",
            admins: [],
            owner: mockUser1,
        },
    },
    {
        rank: 3,
        rankDiff: 0,
        entity: {
            id: "p3",
            name: "anke-to",
            balance: 28000,
            url: "https://anke-to.trap.jp",
            admins: [],
            owner: mockUser2,
        },
    },
    {
        rank: 4,
        rankDiff: 1,
        entity: {
            id: "p4",
            name: "booQ",
            balance: 22000,
            url: "https://booq.trap.jp",
            admins: [],
            owner: mockUser1,
        },
    },
    {
        rank: 5,
        rankDiff: -2,
        entity: { id: "p5", name: "NeoShowcase", balance: 18000, admins: [], owner: mockUser2 },
    },
    {
        rank: 6,
        rankDiff: 0,
        entity: {
            id: "p6",
            name: "Jomon",
            balance: 15000,
            url: "https://jomon.trap.jp",
            admins: [],
            owner: mockUser1,
        },
    },
    {
        rank: 7,
        rankDiff: 3,
        entity: { id: "p7", name: "traPortal", balance: 12000, admins: [], owner: mockUser2 },
    },
    {
        rank: 8,
        rankDiff: -1,
        entity: {
            id: "p8",
            name: "Showcase",
            balance: 9000,
            url: "https://sc.trap.jp",
            admins: [],
            owner: mockUser1,
        },
    },
];

const StatsProjects = () => {
    const { period } = useOutletContext<StatsContext>();
    console.log("Current period:", period); // デバッグ用

    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="md"
        >
            <RankingFull
                items={mockProjectItems}
                maxItems={5}
                title="残高ランキング"
                type="project"
            />
            <RankingFull
                items={mockProjectItems}
                maxItems={5}
                title="取引数ランキング"
                type="project"
            />
            <RankingFull
                items={mockProjectItems}
                maxItems={5}
                title="収入ランキング"
                type="project"
            />
            <RankingFull
                items={mockProjectItems}
                maxItems={5}
                title="支出ランキング"
                type="project"
            />
            <RankingFull
                items={mockProjectItems}
                maxItems={5}
                title="差額ランキング"
                type="project"
            />
            <RankingFull
                items={mockProjectItems}
                maxItems={5}
                title="総額ランキング"
                type="project"
            />
        </SimpleGrid>
    );
};

export default StatsProjects;
