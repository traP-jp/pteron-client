import { useEffect, useState } from "react";

import { Button, Flex, Modal, type ModalProps, Text, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { PAvatar } from "./PAvatar";
import SecretCopyInput from "./SecretCopyInput";

import apis from "../api";
import type { APIClient, Project, User } from "../api/schema/internal";
import { type ProjectName, type Url, type UserName, toBranded } from "../types/entity";

export type EditProjectModalProps = Omit<ModalProps, "title"> & { projectName: ProjectName };

function Admin({
    userName,
    isAdmin: isOwner = false,
    onDelete,
}: {
    userName: UserName;
    onDelete: () => void;
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
    return (
        <Flex
            direction="row"
            gap="sm"
            align="center"
        >
            <Flex
                direction="column"
                gap="sm"
                align="center"
                className="flex-auto"
            >
                <SecretCopyInput
                    value={id}
                    label={"APIクライアントID"}
                />
                {secret && (
                    <SecretCopyInput
                        value={secret}
                        label="APIクライアントシークレット"
                        description="このシークレットは生成時のみ表示されます。超安全に保管してください"
                    />
                )}
            </Flex>
            <Text>{createdAt.toLocaleDateString()} 作成</Text>
            <Button
                color="red"
                ml="auto"
                onClick={onDelete}
            >
                削除
            </Button>
        </Flex>
    );
}

function EditProjectModalContents({ projectName }: { projectName: ProjectName }) {
    const [project, setProject] = useState<Project | null>(null);
    const [apiClients, setApiClients] = useState<APIClient[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    const [url, setUrl] = useState<Url>(toBranded<Url>(""));

    useEffect(() => {
        apis.internal.projects.getProject(projectName).then(({ data }) => {
            setProject(data);
            setUrl(toBranded<Url>(data.url ?? ""));
            setAdmins(toBranded<User[]>(data.admins));
        });
    }, [projectName]);

    useEffect(() => {
        apis.internal.projects
            .getProjectApiClients(projectName)
            .then(({ data }) => setApiClients(data));
    }, [projectName]);

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

    // TODO: ユーザー追加UI

    // function addAdmin(userId: string) {
    //     apis.internal.projects.addProjectAdmin(projectName, { user_id: userId }).then(() => {
    //         setAdmins([...admins, { id: userId, name: userId } as User]);
    //     });
    // }

    function deleteAdmin(userId: string) {
        apis.internal.projects.removeProjectAdmin(projectName, { user_id: userId }).then(() => {
            setAdmins(admins.filter(admin => admin.name != userId));
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
                    <Button
                        color="green.5"
                        size="xs"
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
                        onDelete={() => deleteAdmin(projectOwner.id)}
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
                gap="md"
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
