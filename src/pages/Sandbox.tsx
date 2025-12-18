import { Accordion, Group, Stack, Text, Title } from "@mantine/core";

import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
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

const TrendIndicatorSample = () => (
    <Accordion.Item value="trend-indicator">
        <Accordion.Control>
            <Group>
                <Text fw={500}>TrendIndicator</Text>
                <Text
                    c="dimmed"
                    size="xs"
                >
                    トレンド表示
                </Text>
            </Group>
        </Accordion.Control>
        <Accordion.Panel>
            <Stack gap="xs">
                <Group>
                    <Text
                        size="sm"
                        w={80}
                    >
                        diff=0:
                    </Text>
                    <TrendIndicator diff={0} />
                </Group>
                <Group>
                    <Text
                        size="sm"
                        w={80}
                    >
                        diff=100:
                    </Text>
                    <TrendIndicator diff={100} />
                </Group>
                <Group>
                    <Text
                        size="sm"
                        w={80}
                    >
                        diff=-100:
                    </Text>
                    <TrendIndicator diff={-100} />
                </Group>
            </Stack>
        </Accordion.Panel>
    </Accordion.Item>
);

const PAmountSample = () => (
    <Accordion.Item value="p-amount">
        <Accordion.Control>
            <Group>
                <Text fw={500}>PAmount</Text>
                <Text
                    c="dimmed"
                    size="xs"
                >
                    金額表示
                </Text>
            </Group>
        </Accordion.Control>
        <Accordion.Panel>
            <Stack gap="sm">
                <div>
                    <Text
                        size="xs"
                        c="dimmed"
                        mb={4}
                    >
                        正の値（カスタムサイズ・アイコン付き・ダッシュ付き）
                    </Text>
                    <PAmount
                        value={toBranded<Copia>(100000000n)}
                        coloring
                        size="custom"
                        customSize={5}
                        leadingIcon
                        trailingDash
                    />
                </div>
                <div>
                    <Text
                        size="xs"
                        c="dimmed"
                        mb={4}
                    >
                        負の値（グループなし）
                    </Text>
                    <PAmount
                        value={toBranded<Copia>(-100000000n)}
                        coloring
                        size="xl"
                        formatOptions={{ useGrouping: false }}
                    />
                </div>
            </Stack>
        </Accordion.Panel>
    </Accordion.Item>
);

export const PAvatarSample = () => (
    <Accordion.Item value="p-avatar">
        <Accordion.Control>
            <Group>
                <Text fw={500}>PAvatar</Text>
                <Text
                    c="dimmed"
                    size="xs"
                >
                    アバター表示
                </Text>
            </Group>
        </Accordion.Control>
        <Accordion.Panel>
            <Stack gap="sm">
                <div>
                    <Text
                        size="xs"
                        c="dimmed"
                        mb={4}
                    >
                        {'type="user"'}
                    </Text>
                    <PAvatar
                        name={toBranded<UserName>("uni_kakurenbo")}
                        type="user"
                    />
                </div>
                <div>
                    <Text
                        size="xs"
                        c="dimmed"
                        mb={4}
                    >
                        {'type="project"'}
                    </Text>
                    <PAvatar
                        name={toBranded<ProjectName>("awesome_project")}
                        type="project"
                    />
                </div>
            </Stack>
        </Accordion.Panel>
    </Accordion.Item>
);

const RankingFullSample = () => {
    const handleUserClick = (rankedUser: RankedUser) => {
        console.log("Clicked user:", rankedUser);
    };

    return (
        <Accordion.Item value="ranking-full">
            <Accordion.Control>
                <Group>
                    <Text fw={500}>RankingFull</Text>
                    <Text
                        c="dimmed"
                        size="xs"
                    >
                        ランキング全体表示（Top3 + リスト）
                    </Text>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <RankingFull
                    maxItems={20}
                    onUserClick={handleUserClick}
                    title="This is Ranking"
                    users={mockUsers}
                />
            </Accordion.Panel>
        </Accordion.Item>
    );
};

export const Sandbox = () => {
    return (
        <Stack
            gap="md"
            p="md"
        >
            <Title order={1}>Sandbox</Title>
            <Text
                c="dimmed"
                size="sm"
            >
                コンポーネントのデバッグ・動作確認用ページ
            </Text>

            {/* 基本部品 */}
            <Accordion
                variant="separated"
                multiple
                defaultValue={["trend-indicator"]}
            >
                <Title
                    order={3}
                    mb="xs"
                >
                    基本部品
                </Title>

                <TrendIndicatorSample />

                <PAmountSample />

                <PAvatarSample />
            </Accordion>

            {/* 複合コンポーネント */}
            <Accordion
                variant="separated"
                multiple
            >
                <Title
                    order={3}
                    mb="xs"
                >
                    複合コンポーネント
                </Title>

                <RankingFullSample />
            </Accordion>
        </Stack>
    );
};

export default Sandbox;
