import { Suspense, use } from "react";
import { useParams } from "react-router-dom";

import { ActionIcon, Button, Card, Divider, Flex, SimpleGrid, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconExternalLink } from "@tabler/icons-react";

import apis from "/@/api";
import type { Project, User } from "/@/api/schema/internal";
import type { Transaction } from "/@/api/schema/internal";
import { EntityCard } from "/@/components/EntityCard";
import ErrorBoundary from "/@/components/ErrorBoundary";
import { PAmount } from "/@/components/PAmount";
import { PAvatar } from "/@/components/PAvatar";
import { TransactionList } from "/@/components/TransactionList";
import BalanceChart from "/@/components/ranking/BalanceChart";
import { ProjectRankingBadges, ProjectRankingCards } from "/@/components/ranking/RankingBadges";
import { ProjectDetailsSkeleton } from "/@/components/skeletons/PageSkeletons";
import { createExternalLinkHandler } from "/@/lib/link";
import { type Copia, type ProjectName, type UserName, toBranded } from "/@/types/entity";
import type { Url } from "/@/types/entity";

import { EditProjectModal } from "../components/EditProjectModal";

const ProjectHeader = ({
    name,
    balance,
    isAdmin,
    url,
}: {
    name: ProjectName;
    balance: Copia;
    isAdmin: boolean;
    url?: Url;
}) => {
    const handleExternalLinkClick = url ? createExternalLinkHandler(url) : undefined;
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Flex
            direction="column"
            mt="lg"
            mb="xs"
            gap="sm"
        >
            <Flex
                direction="row"
                align="center"
                wrap="wrap"
            >
                <Flex
                    direction="row"
                    align="center"
                    gap={{ base: "xs", sm: "xl" }}
                    ml={{ base: "xs", sm: "xl" }}
                    wrap="wrap"
                >
                    <PAvatar
                        size="xl"
                        name={name}
                        type="project"
                    />
                    <Flex
                        direction="row"
                        align="center"
                        gap="xs"
                    >
                        <Text
                            size="xl"
                            fw={700}
                        >
                            {name}
                        </Text>
                        {url && (
                            <ActionIcon
                                aria-label="サイトを開く"
                                color="gray"
                                onClick={handleExternalLinkClick}
                                size="lg"
                                variant="subtle"
                            >
                                <IconExternalLink size={20} />
                            </ActionIcon>
                        )}
                    </Flex>
                    {isAdmin && (
                        <>
                            <EditProjectModal
                                projectName={name}
                                opened={opened}
                                onClose={close}
                            />
                            <Button
                                variant="light"
                                size="sm"
                                onClick={open}
                            >
                                プロジェクトを管理
                            </Button>
                        </>
                    )}
                </Flex>

                <PAmount
                    ml="auto"
                    mr="xl"
                    value={balance}
                    leadingIcon
                    coloring
                    size="custom"
                    customSize={2}
                />
            </Flex>
            <Flex ml="xl">
                <ProjectRankingBadges projectName={name} />
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
                <Text
                    size="xl"
                    fw={400}
                    mb="md"
                >
                    推移
                </Text>
                <BalanceChart
                    h={320}
                    transactions={transactions}
                    viewType="project"
                />
            </Card>

            <Divider
                orientation="vertical"
                visibleFrom="sm"
            />

            <Card
                className="w-full sm:w-auto sm:min-w-md"
                p="lg"
                h="100%"
                style={{ display: "flex", flexDirection: "column" }}
            >
                <Text
                    size="xl"
                    fw={400}
                    mb="md"
                >
                    取引履歴
                </Text>
                {!transactions && <Text c="dimmed">取引履歴がありません</Text>}
                <div className="h-80 overflow-auto">
                    <TransactionList
                        transactions={transactions}
                        currentType="project"
                    />
                </div>
            </Card>
        </Flex>
    );
};

const ProjectMemberList = ({ owner, admins }: { owner?: User; admins?: User[] }) => {
    const members = [
        ...(owner ? [owner] : []),
        ...(admins ?? []).filter(admin => admin.id !== owner?.id),
    ].filter(Boolean);

    return (
        <>
            <Text
                size="xl"
                fw={400}
            >
                メンバー
            </Text>

            {members.length === 0 ? (
                <Flex
                    justify="center"
                    align="center"
                    style={{ minHeight: 200 }}
                >
                    <Text
                        size="lg"
                        c="dimmed"
                    >
                        メンバーがいません
                    </Text>
                </Flex>
            ) : (
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
            )}
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
    const url = project.url ? toBranded<Url>(project.url) : undefined;

    // 管理者判定
    const isAdmin =
        project.owner?.id === currentUserId ||
        (project.admins ?? []).some(admin => admin.id === currentUserId);

    return (
        <Stack
            gap="md"
            p="md"
        >
            <ProjectHeader
                name={name}
                balance={balance}
                isAdmin={isAdmin}
                url={url}
            />
            <Divider />
            <ProjectDetail transactions={transactions} />
            <Divider />
            <ProjectMemberList
                owner={project.owner}
                admins={project.admins}
            />
            <Divider />
            <ErrorBoundary>
                <Text
                    size="xl"
                    fw={400}
                >
                    ランキング
                </Text>
                <ProjectRankingCards projectName={name} />
            </ErrorBoundary>
        </Stack>
    );
};

const ProjectDetails = () => {
    const { projectId: _projectName } = useParams();
    const projectName = toBranded<ProjectName>(_projectName ?? "");

    const fetch = async () => {
        try {
            const { data: project } = await apis.internal.projects.getProject(projectName);
            const { data: transactionsData } =
                await apis.internal.transactions.getProjectTransactions(projectName);
            const { data: currentUser } = await apis.internal.me.getCurrentUser();

            // transactions が undefined または items が undefined の場合に安全に処理
            const transactions = (transactionsData?.items ?? []).filter(Boolean);

            return {
                project,
                transactions,
                currentUserId: currentUser.id,
            };
        } catch (error) {
            console.error("Failed to fetch project details:", error);
            throw error;
        }
    };

    return (
        <>
            <ErrorBoundary>
                <Suspense fallback={<ProjectDetailsSkeleton />}>
                    <TheProjectDetails fetcher={fetch()} />
                </Suspense>
            </ErrorBoundary>
        </>
    );
};
export default ProjectDetails;
