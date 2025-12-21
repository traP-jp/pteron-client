import { Suspense, use, useMemo, useState } from "react";

import { Button, Flex, Modal, type ModalProps, MultiSelect, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { encode } from "js-base64";

import ErrorBoundary from "./ErrorBoundary";
import { PAvatar } from "./PAvatar";
import SecretCopyInput from "./SecretCopyInput";
import { EditProjectModalSkeleton } from "./skeletons/PageSkeletons";

import apis from "../api";
import type { APIClient, Project, User } from "../api/schema/internal";
import { type ProjectName, type Url, type UserName, toBranded } from "../types/entity";

export type EditProjectModalProps = Omit<ModalProps, "title"> & { projectName: ProjectName };
type AddAdminModalProps = Omit<ModalProps, "title">;

type EditProjectData = {
    project: Project;
    apiClients: APIClient[];
    users: User[];
};

type Fetcher = Promise<EditProjectData>;

function Admin({
    userName,
    isOwner = false,
    onDelete,
}: {
    userName: UserName;
    onDelete?: () => void;
    isOwner?: boolean;
}) {
    return (
        <Flex
            direction="row"
            gap="sm"
            align="center"
        >
            <PAvatar
                type="user"
                name={userName}
            />
            <Text>{userName}</Text>
            {isOwner && <Text c="blue">(Owner)</Text>}
            {!isOwner && (
                <Button
                    color="red"
                    ml="auto"
                    onClick={onDelete}
                >
                    削除
                </Button>
            )}
        </Flex>
    );
}

function ClientKeyBox({
    id,
    secret,
    createdAt,
    onDelete,
}: {
    id: string;
    secret?: string;
    createdAt: Date;
    onDelete: () => void;
}) {
    const accessToken = secret ? encode(`${id}:${secret}`) : "";
    const displayClientId = `${id.slice(-12)}`;

    return (
        <Flex
            direction={{ base: "column", sm: "row" }}
            gap="sm"
            align={{ base: "end", sm: "end" }}
            justify="center"
        >
            <Flex
                direction="column"
                gap="sm"
                align="start"
                justify="start"
                className="flex-auto w-full"
            >
                <SecretCopyInput
                    value={accessToken}
                    label={displayClientId}
                    disabled={!secret}
                    placeholder="AccessToken は初回のみ表示できます。"
                />
            </Flex>
            <Flex
                direction="row"
                gap="sm"
                align="center"
                justify="flex-end"
            >
                <Text className="min-w-max">{createdAt.toLocaleDateString()} 作成</Text>
                <Button
                    color="red"
                    ml="auto"
                    onClick={onDelete}
                >
                    削除
                </Button>
            </Flex>
        </Flex>
    );
}

function AddAdminModal({
    onClose: _onClose,
    admins,
    users,
    owner,
    onAddAdmins,
    ...props
}: AddAdminModalProps & {
    admins: User[];
    users: User[];
    owner: User;
    onAddAdmins: (userNames: string[]) => Promise<void>;
}) {
    const [candidateNames, setCandidateNames] = useState<string[]>([]);

    const handleClose = () => {
        setCandidateNames([]);
        _onClose();
    };

    const handleAdd = async () => {
        await onAddAdmins(candidateNames);
        handleClose();
    };

    const availableUsers = users
        .filter(user => !admins.some(admin => admin.id === user.id) && owner.id !== user.id)
        .map(user => user.name);

    return (
        <Modal
            onClose={handleClose}
            {...props}
            title="管理者追加"
        >
            <Flex
                direction="column"
                gap="md"
            >
                <MultiSelect
                    data={availableUsers}
                    value={candidateNames}
                    onChange={setCandidateNames}
                    searchable
                />
                <Flex
                    direction="row"
                    gap="md"
                    justify="flex-end"
                >
                    <Button onClick={handleClose}>キャンセル</Button>
                    <Button
                        disabled={candidateNames.length === 0}
                        onClick={handleAdd}
                    >
                        追加
                    </Button>
                </Flex>
            </Flex>
        </Modal>
    );
}

function EditProjectModalContents({
    projectName,
    fetcher,
}: {
    projectName: ProjectName;
    fetcher: Fetcher;
}) {
    const { project, apiClients: initialApiClients, users } = use(fetcher);

    const [apiClients, setApiClients] = useState<APIClient[]>(initialApiClients);
    const [admins, setAdmins] = useState<User[]>(project.admins);
    const [url, setUrl] = useState<Url>(toBranded<Url>(project.url ?? ""));

    const [opened, { open, close }] = useDisclosure(false);

    const projectOwner = project.owner;

    const handleCreateApiClient = async () => {
        const { data } = await apis.internal.projects.createProjectApiClient(projectName);
        setApiClients(prev => [...prev, data]);
    };

    const handleDeleteApiClient = async (clientId: string) => {
        await apis.internal.projects.deleteProjectApiClient(projectName, clientId);
        setApiClients(prev => prev.filter(client => client.clientId !== clientId));
    };

    const handleAddAdmins = async (userNames: string[]) => {
        await Promise.all(
            userNames.map(userName =>
                apis.internal.projects.addProjectAdmin(projectName, { userId: userName })
            )
        );
        const newAdmins = users.filter(user => userNames.includes(user.name));
        setAdmins(prev => [...prev, ...newAdmins]);
    };

    const handleDeleteAdmin = async (userId: string) => {
        await apis.internal.projects.removeProjectAdmin(projectName, { userId });
        setAdmins(prev => prev.filter(admin => admin.id !== userId));
    };

    const handleUpdateUrl = async () => {
        await apis.internal.projects.updateProject(projectName, { url });
        showNotification({
            title: "URLを更新しました",
            message: "プロジェクトURLが正常に更新されました",
            color: "green",
        });
    };

    return (
        <>
            <Flex
                direction="row"
                gap="md"
                align="flex-end"
            >
                <TextInput
                    className="flex-auto"
                    label="URL"
                    value={url}
                    onChange={e => setUrl(toBranded<Url>(e.currentTarget.value))}
                />
                <Button onClick={handleUpdateUrl}>更新</Button>
            </Flex>
            <Flex
                direction="column"
                gap="md"
            >
                <Flex
                    direction="row"
                    gap="xl"
                    mt="md"
                    align="flex-center"
                >
                    <Text>管理者</Text>
                    <AddAdminModal
                        admins={admins}
                        users={users}
                        owner={projectOwner}
                        onAddAdmins={handleAddAdmins}
                        opened={opened}
                        onClose={close}
                    />
                    <Button
                        color="green.5"
                        size="xs"
                        onClick={open}
                    >
                        <IconPlus /> 追加
                    </Button>
                </Flex>
                <Flex
                    direction="column"
                    gap="sm"
                >
                    <Admin
                        userName={toBranded<UserName>(projectOwner.name)}
                        isOwner
                    />
                    {admins
                        .filter(admin => admin.id !== projectOwner.id)
                        .map(admin => (
                            <Admin
                                key={admin.id}
                                userName={toBranded<UserName>(admin.name)}
                                onDelete={() => handleDeleteAdmin(admin.id)}
                            />
                        ))}
                </Flex>
            </Flex>
            <Flex
                direction="column"
                gap="xs"
            >
                <Flex
                    direction="row"
                    gap="xl"
                    mt="md"
                    align="flex-center"
                >
                    <Text>APIクライアント</Text>
                    <Button
                        color="green.5"
                        size="xs"
                        onClick={handleCreateApiClient}
                    >
                        <IconPlus /> 追加
                    </Button>
                </Flex>
                <Text
                    size="xs"
                    c="gray.7"
                >
                    AccessToken は生成時のみ表示されます。
                </Text>
                <Flex
                    direction="column"
                    gap="md"
                >
                    {apiClients.map(client => (
                        <ClientKeyBox
                            key={client.clientId}
                            id={client.clientId}
                            secret={client.clientSecret}
                            createdAt={new Date(client.createdAt)}
                            onDelete={() => handleDeleteApiClient(client.clientId)}
                        />
                    ))}
                </Flex>
            </Flex>
        </>
    );
}

const fetchEditProjectData = async (projectName: ProjectName): Promise<EditProjectData> => {
    const [projectRes, apiClientsRes, usersRes] = await Promise.all([
        apis.internal.projects.getProject(projectName),
        apis.internal.projects.getProjectApiClients(projectName),
        apis.internal.users.getUsers(),
    ]);

    return {
        project: projectRes.data,
        apiClients: apiClientsRes.data,
        users: usersRes.data.items,
    };
};

export function EditProjectModal(props: EditProjectModalProps & { projectName: ProjectName }) {
    const fetcher = useMemo(() => fetchEditProjectData(props.projectName), [props.projectName]);

    return (
        <Modal
            size="lg"
            {...props}
            title="プロジェクト管理"
        >
            <ErrorBoundary>
                <Suspense fallback={<EditProjectModalSkeleton />}>
                    <EditProjectModalContents
                        projectName={props.projectName}
                        fetcher={fetcher}
                    />
                </Suspense>
            </ErrorBoundary>
        </Modal>
    );
}
