import { useEffect, useState } from "react";

import { Button, Flex, Modal, type ModalProps, MultiSelect, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

import { PAvatar } from "./PAvatar";
import SecretCopyInput from "./SecretCopyInput";

import apis from "../api";
import type { APIClient, Project, User } from "../api/schema/internal";
import { type ProjectName, type Url, type UserName, toBranded } from "../types/entity";

export type EditProjectModalProps = Omit<ModalProps, "title"> & { projectName: ProjectName };
type AddAdminModalProps = Omit<ModalProps, "title">;

function Admin({
    userName,
    isAdmin: isOwner = false,
    onDelete,
}: {
    userName: UserName;
    onDelete?: () => void;
    isAdmin?: boolean;
}) {
    return (
        <>
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
        </>
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
    const accessToken = secret ? `${id}.${secret}` : "";
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
    ...props
}: AddAdminModalProps & {
    admins: User[];
    users: User[];
    owner: User;
    addNewAdmins: (admins: string[]) => Promise<void>;
}) {
    const [candidateIds, setCandidateIds] = useState<string[]>([]);

    const onClose = () => {
        setCandidateIds([]);
        _onClose();
    };
    return (
        <>
            <Modal
                onClose={onClose}
                {...props}
                title="管理者追加"
            >
                <Flex
                    direction="column"
                    gap="md"
                >
                    <MultiSelect
                        data={props.users
                            .filter(
                                user =>
                                    !props.admins.some(
                                        admin => admin.id === user.id || props.owner.id === user.id
                                    )
                            )
                            .map(user => user.name)}
                        value={candidateIds}
                        onChange={setCandidateIds}
                        searchable
                    />
                    <Flex
                        direction="row"
                        gap="md"
                        justify="flex-end"
                    >
                        <Button onClick={onClose}>キャンセル</Button>
                        <Button
                            disabled={candidateIds.length === 0}
                            onClick={() => props.addNewAdmins(candidateIds).then(onClose)}
                        >
                            追加
                        </Button>
                    </Flex>
                </Flex>
            </Modal>
        </>
    );
}

function EditProjectModalContents({ projectName }: { projectName: ProjectName }) {
    const [project, setProject] = useState<Project | null>(null);
    const [apiClients, setApiClients] = useState<APIClient[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [url, setUrl] = useState<Url>(toBranded<Url>(""));

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        apis.internal.projects.getProject(projectName).then(({ data }) => {
            setProject(data);
            setUrl(toBranded<Url>(data.url ?? ""));
            setAdmins(toBranded<User[]>([...data.admins, data.owner]));
        });
    }, [projectName]);

    useEffect(() => {
        apis.internal.projects
            .getProjectApiClients(projectName)
            .then(({ data }) => setApiClients(data));
    }, [projectName]);

    useEffect(() => {
        apis.internal.users.getUsers().then(({ data }) => {
            setUsers(data.items);
        });
    }, []);

    if (!project) return <></>;

    const projectAdmins = toBranded<User[]>(project.admins);
    const projectOwner = toBranded<User>(project.owner);

    function createApiClient() {
        apis.internal.projects.createProjectApiClient(projectName).then(({ data }) => {
            setApiClients([...apiClients, data]);
        });
    }

    function deleteApiClient(clientId: string) {
        apis.internal.projects.deleteProjectApiClient(projectName, clientId).then(() => {
            setApiClients(apiClients.filter(client => client.client_id != clientId));
        });
    }

    function addNewAdmins(userIds: string[]) {
        return Promise.all(
            userIds.map(userId =>
                apis.internal.projects.addProjectAdmin(projectName, { user_id: userId })
            )
        ).then(() => {
            setAdmins([...admins, ...users.filter(user => userIds.some(id => id === user.id))]);
        });
    }

    function deleteAdmin(userId: string) {
        apis.internal.projects.removeProjectAdmin(projectName, { user_id: userId }).then(() => {
            setAdmins(admins.filter(admin => admin.id !== userId));
        });
    }

    function updateUrl() {
        apis.internal.projects.updateProject(projectName, { url: url });
    }

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
                    onChange={e => {
                        setUrl(toBranded<Url>(e.currentTarget.value));
                    }}
                />
                <Button onClick={updateUrl}>更新</Button>
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
                        admins={projectAdmins}
                        users={users}
                        owner={projectOwner}
                        addNewAdmins={addNewAdmins}
                        opened={opened}
                        onClose={close}
                    />
                    <Button
                        color="green.5"
                        size="xs"
                        onClick={open}
                    >
                        <IconPlus /> 追加{" "}
                    </Button>
                </Flex>
                <Flex
                    direction="column"
                    gap="sm"
                >
                    <Admin
                        userName={toBranded<UserName>(projectOwner.name)}
                        isAdmin
                    />
                    {projectAdmins.map(admin => (
                        <Admin
                            key={admin.id}
                            userName={toBranded<UserName>(admin.name)}
                            onDelete={() => deleteAdmin(admin.id)}
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
                        onClick={() => createApiClient()}
                    >
                        <IconPlus /> 追加{" "}
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
                            key={client.client_id}
                            id={client.client_id}
                            secret={client.client_secret}
                            createdAt={new Date(client.created_at)}
                            onDelete={() => deleteApiClient(client.client_id)}
                        />
                    ))}
                </Flex>
            </Flex>
        </>
    );
}

export function EditProjectModal(props: EditProjectModalProps & { projectName: ProjectName }) {
    return (
        <>
            <Modal
                size="lg"
                {...props}
                title="プロジェクト管理"
            >
                <EditProjectModalContents projectName={props.projectName} />
            </Modal>
        </>
    );
}
