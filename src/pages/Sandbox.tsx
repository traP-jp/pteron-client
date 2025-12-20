import { Accordion, Button, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import type { Project, Transaction, User } from "/@/api/schema/internal";
import { CreateProjectModal } from "/@/components/CreateProjectModal";
import { EntityCard } from "/@/components/EntityCard";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TransactionList } from "/@/components/TransactionList";
import { TrendIndicator } from "/@/components/TrendIndicator";
import type { RankedItem } from "/@/components/ranking";
import { RankingFull } from "/@/components/ranking";
import BalanceChart from "/@/components/ranking/BalanceChart";
import { type Copia, type ProjectName, type Url, type UserName, toBranded } from "/@/types/entity";

import { SYSTEM_NAME } from "../config/constants";

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
            <ErrorBoundary>
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
            </ErrorBoundary>
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
            <ErrorBoundary>
                <Stack gap="sm">
                    <>
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
                    </>
                    <>
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
                    </>
                </Stack>
            </ErrorBoundary>
        </Accordion.Panel>
    </Accordion.Item>
);

const PAvatarSample = () => (
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
            <ErrorBoundary>
                <Stack gap="sm">
                    <>
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
                    </>
                    <>
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
                    </>
                    <>
                        <Text
                            size="xs"
                            c="dimmed"
                            mb={4}
                        >
                            {'type="system"'}
                        </Text>
                        <PAvatar
                            type="system"
                            name={SYSTEM_NAME}
                        />
                    </>
                </Stack>
            </ErrorBoundary>
        </Accordion.Panel>
    </Accordion.Item>
);

const EntityCardSample = () => (
    <Accordion.Item value="user-card">
        <Accordion.Control>
            <Group>
                <Text fw={500}>EntityCard</Text>
                <Text
                    c="dimmed"
                    size="xs"
                >
                    ユーザー / プロジェクト 情報
                </Text>
            </Group>
        </Accordion.Control>
        <Accordion.Panel>
            <ErrorBoundary>
                <Stack gap="sm">
                    <>
                        <Text
                            size="xs"
                            c="dimmed"
                            mb={4}
                        >
                            {'type="user"'}
                        </Text>
                        <EntityCard
                            padding="xs"
                            p="lg"
                            withBorder
                            radius="md"
                            amount={toBranded<Copia>(1000000n)}
                            name={toBranded<UserName>("uni_kakurenbo")}
                            type="user"
                        />
                    </>
                    <>
                        <Text
                            size="xs"
                            c="dimmed"
                            mb={4}
                        >
                            {'type="project"'}
                        </Text>
                        <EntityCard
                            padding="xs"
                            p="lg"
                            withBorder
                            radius="md"
                            amount={toBranded<Copia>(10000000000n)}
                            name={toBranded<ProjectName>("awesome_project")}
                            extraLink={toBranded<Url>("https://q.trap.jp")}
                            type="project"
                        />
                    </>
                </Stack>
            </ErrorBoundary>
        </Accordion.Panel>
    </Accordion.Item>
);

const RankingFullSample = () => {
    const handleUserClick = (item: RankedItem<User>) => {
        console.log("Clicked user:", item);
    };

    const handleProjectClick = (item: RankedItem<Project>) => {
        console.log("Clicked project:", item);
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
                <ErrorBoundary>
                    <Stack gap="md">
                        <Text
                            fw={500}
                            size="sm"
                        >
                            ユーザーランキング
                        </Text>
                        <RankingFull
                            type="user"
                            items={mockUserItems}
                            maxItems={10}
                            onItemClick={handleUserClick}
                            title="User Ranking"
                        />
                        <Text
                            fw={500}
                            size="sm"
                        >
                            プロジェクトランキング（外部リンクアイコン付き）
                        </Text>
                        <RankingFull
                            type="project"
                            items={mockProjectItems}
                            maxItems={6}
                            onItemClick={handleProjectClick}
                            title="Project Ranking"
                        />
                    </Stack>
                </ErrorBoundary>
            </Accordion.Panel>
        </Accordion.Item>
    );
};

const CreateProjectModalSample = () => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <Accordion.Item value="create-project-modal">
            <Accordion.Control>
                <Group>
                    <Text fw={500}>CreateProjectModal</Text>
                    <Text
                        c="dimmed"
                        size="xs"
                    >
                        プロジェクト作成モーダル
                    </Text>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <ErrorBoundary>
                    <Stack gap="sm">
                        <CreateProjectModal
                            opened={opened}
                            onClose={close}
                        />
                        <Button
                            variant="default"
                            onClick={open}
                        >
                            新規プロジェクトを作成
                        </Button>
                    </Stack>
                </ErrorBoundary>
            </Accordion.Panel>
        </Accordion.Item>
    );
};
const TransactionListSample = () => (
    <Accordion.Item value="transaction-list">
        <Accordion.Control>
            <Group>
                <Text fw={500}>TransactionList</Text>
                <Text
                    c="dimmed"
                    size="xs"
                >
                    取引履歴表示
                </Text>
            </Group>
        </Accordion.Control>
        <Accordion.Panel>
            <ErrorBoundary>
                <Stack gap="md">
                    <div>
                        <Text
                            size="xs"
                            c="dimmed"
                            mb={4}
                        >
                            {'currentType="user" direction="auto"'}
                        </Text>
                        <TransactionList
                            transactions={mockTransactions}
                            currentType="user"
                            direction="auto"
                        />
                    </div>
                    <div>
                        <Text
                            size="xs"
                            c="dimmed"
                            mb={4}
                        >
                            {'currentType="project" direction="auto"'}
                        </Text>
                        <TransactionList
                            transactions={mockTransactions}
                            currentType="project"
                            direction="auto"
                        />
                    </div>
                </Stack>
            </ErrorBoundary>
        </Accordion.Panel>
    </Accordion.Item>
);

const BalanceChartSample = () => (
    <Accordion.Item value="transaction-chart">
        <Accordion.Control>
            <Group>
                <Text fw={500}>TransactionChart</Text>
                <Text
                    c="dimmed"
                    size="xs"
                >
                    残高推移
                </Text>
            </Group>
        </Accordion.Control>
        <Accordion.Panel>
            <ErrorBoundary>
                <BalanceChart
                    h={300}
                    transactions={mockTransactions}
                />
            </ErrorBoundary>
        </Accordion.Panel>
    </Accordion.Item>
);

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

                <EntityCardSample />

                <BalanceChartSample />
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

                <CreateProjectModalSample />
                <TransactionListSample />
            </Accordion>
        </Stack>
    );
};

export default Sandbox;

// モックデータ（デバッグ用）
const mockUserItems: RankedItem<User>[] = [
    { rank: 1, rankDiff: 1, entity: { id: "1", name: "alice", balance: 15000 } },
    { rank: 2, rankDiff: -1, entity: { id: "2", name: "bob", balance: 12500 } },
    { rank: 3, rankDiff: -1, entity: { id: "3", name: "charlie", balance: 10000 } },
    { rank: 4, rankDiff: 2, entity: { id: "4", name: "david", balance: 8500 } },
    { rank: 5, rankDiff: 0, entity: { id: "5", name: "eve", balance: 7200 } },
    { rank: 6, rankDiff: -3, entity: { id: "6", name: "frank", balance: 6800 } },
    { rank: 7, rankDiff: 0, entity: { id: "7", name: "grace", balance: 5500 } },
    { rank: 8, rankDiff: 5, entity: { id: "8", name: "henry", balance: 4200 } },
    { rank: 9, rankDiff: -1, entity: { id: "9", name: "ivy", balance: 3800 } },
    { rank: 10, rankDiff: -2, entity: { id: "10", name: "jack", balance: 3000 } },
];

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
];

const mockProject1: Project = {
    id: "p1",
    name: "traQ",
    balance: 50000,
    url: "https://q.trap.jp",
    admins: [],
    owner: mockUser1,
};
const mockProject2: Project = {
    id: "p2",
    name: "knoQ",
    balance: 35000,
    url: "https://knoq.trap.jp",
    admins: [],
    owner: mockUser2,
};
const mockProject3: Project = {
    id: "p3",
    name: "anke-to",
    balance: 28000,
    url: "https://anke-to.trap.jp",
    admins: [],
    owner: mockUser1,
};

const mockTransactions: Transaction[] = [
    {
        id: "1a2b3c4d-5e6f-7890-abcd-ef1234567890",
        type: "TRANSFER",
        amount: 10000,
        project: mockProject1,
        user: mockUser1,
        description: "プロジェクトからの報酬",
        createdAt: "2025-12-18T10:00:00Z",
    },
    {
        id: "2b3c4d5e-6f7a-8901-bcde-f12345678901",
        type: "BILL_PAYMENT",
        amount: 5000,
        project: mockProject2,
        user: mockUser1,
        description: "サービス利用料",
        createdAt: "2025-12-17T15:30:00Z",
    },
    {
        id: "3c4d5e6f-7a8b-9012-cdef-123456789012",
        type: "TRANSFER",
        amount: 25000,
        project: mockProject1,
        user: mockUser2,
        description: "ボーナス",
        createdAt: "2025-12-16T09:00:00Z",
    },
    {
        id: "4d5e6f7a-8b9c-0123-def1-234567890123",
        type: "BILL_PAYMENT",
        amount: 3000,
        project: mockProject3,
        user: mockUser1,
        description: "月額料金",
        createdAt: "2025-12-15T12:00:00Z",
    },
];
