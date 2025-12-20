import { Suspense, use } from "react";
import { useParams } from "react-router-dom";

import { Button, Card, Divider, Flex, SimpleGrid, Text, Title } from "@mantine/core";

import apis from "/@/api";
import type { Project, User } from "/@/api/schema/internal";
import type { Transaction } from "/@/api/schema/internal";
import { EntityCard } from "/@/components/EntityCard";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TransactionList } from "/@/components/TransactionList";
import BalanceChart from "/@/components/ranking/BalanceChart";
import { type Copia, type ProjectName, type UserName, toBranded } from "/@/types/entity";

const ProjectHeader = ({
    name,
    balance,
    isAdmin,
}: {
    name: ProjectName;
    balance: Copia;
    isAdmin: boolean;
}) => {
    return (
        <Flex
            direction="column"
            mt="lg"
            mb="xs"
        >
            <Flex
                direction="row"
                align="center"
            >
                <Flex
                    direction="row"
                    align="center"
                    gap="xl"
                    ml="xl"
                >
                    <PAvatar
                        size="xl"
                        name={name}
                        type="project"
                    />
                    <Text
                        size="xl"
                        fw={700}
                    >
                        {name}
                    </Text>
                    {isAdmin && (
                        <Button
                            variant="light"
                            size="sm"
                        >
                            プロジェクトを管理
                        </Button>
                    )}
                </Flex>
                <Flex
                    ml="auto"
                    mr="xl"
                    align="center"
                    gap="md"
                >
                    <PAmount
                        value={balance}
                        leadingIcon
                        coloring
                        size="custom"
                        customSize={2}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

const ProjectDetail = ({ transactions }: { transactions: Transaction[] }) => {
    return (
        <Flex
            wrap="wrap"
            direction="row"
            gap="md"
        >
            <Card
                className="flex-auto"
                p="lg"
                h="100%"
            >
                <Title
                    order={2}
                    fw={400}
                    mb="md"
                >
                    推移
                </Title>
                {/* transactions が undefined の場合は空配列を渡してクラッシュを防ぐ */}
                <BalanceChart
                    h={320}
                    transactions={transactions ?? []}
                />
            </Card>

            <Divider orientation="vertical" />

            <Card
                className="min-w-md"
                p="lg"
                h="100%"
                style={{ display: "flex", flexDirection: "column" }}
            >
                <Title
                    order={2}
                    fw={400}
                    mb="md"
                >
                    取引履歴
                </Title>
                {!transactions && <Text c="dimmed">取引履歴がありません</Text>}
                <div className="h-80 overflow-auto">
                    {/* 同様に安全な配列を渡す */}
                    <TransactionList
                        transactions={transactions ?? []}
                        currentType="project"
                    />
                </div>
            </Card>
        </Flex>
    );
};

const ProjectMemberList = ({ owner, admins }: { owner?: User; admins?: User[] }) => {
    const members = [...(owner ? [owner] : []), ...(admins ?? [])].filter(Boolean);

    return (
        <>
            <Title
                order={2}
                fw={400}
            >
                メンバー
            </Title>

            <SimpleGrid
                cols={{ base: 1, md: 2, xl: 3 }}
                spacing="md"
            >
                {members.map(u => (
                    <EntityCard
                        key={u.id}
                        p="xl"
                        withBorder
                        radius="md"
                        type="user"
                        amount={toBranded<Copia>(BigInt(u.balance))}
                        name={toBranded<UserName>(u.name)}
                    />
                ))}
            </SimpleGrid>
        </>
    );
};

const TheProjectDetails = ({
    fetcher,
}: {
    fetcher: Promise<{ project: Project; transactions: Transaction[]; currentUserId: string }>;
}) => {
    const { project, transactions, currentUserId } = use(fetcher);

    const name = toBranded<ProjectName>(project.name);
    const balance = toBranded<Copia>(BigInt(project.balance));

    // 管理者判定
    const isAdmin =
        project.owner?.id === currentUserId ||
        (project.admins ?? []).some(admin => admin.id === currentUserId);

    return (
        <Flex
            direction="column"
            gap="md"
        >
            <ProjectHeader
                name={name}
                balance={balance}
                isAdmin={isAdmin}
            />
            <Divider />
            <ProjectDetail transactions={transactions} />
            <Divider />
            <ProjectMemberList
                owner={project.owner}
                admins={project.admins}
            />
        </Flex>
    );
};

const ProjectDetails = () => {
    const { projectId: _projectName } = useParams();
    const projectName = toBranded<ProjectName>(_projectName ?? "");

    const fetch = async () => {
        const { data: project } = await apis.internal.projects.getProject(projectName);
        const {
            data: { items: transactions },
        } = await apis.internal.transactions.getProjectTransactions(projectName);
        const { data: currentUser } = await apis.internal.me.getCurrentUser();

        // transactions が undefined の場合は空配列を返す
        return {
            project,
            transactions: transactions ?? [],
            currentUserId: currentUser.id,
        };
    };

    // Suspense に fallback を渡す（コメントは JSX の外へ）
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TheProjectDetails fetcher={fetch()} />
        </Suspense>
    );
};
export default ProjectDetails;
