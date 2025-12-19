import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { AppShell, Group, Stack, Tooltip, UnstyledButton, rem } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
    IconChartBar,
    IconFolders,
    IconHome,
    IconTestPipe,
    IconUsersGroup,
} from "@tabler/icons-react";

import CopiaLogoSrc from "/@/assets/icons/copiaLogo.svg";
import { toBranded } from "/@/types/entity";
import type { UserName } from "/@/types/entity";

import { PAvatar } from "./components/PAvatar";

const navItems = [
    { icon: IconHome, label: "Dashboard", to: "/" },
    { icon: IconFolders, label: "Projects", to: "/projects" },
    { icon: IconUsersGroup, label: "Users", to: "/users" },
    { icon: IconChartBar, label: "Stats", to: "/stats" },
    // 開発環境のみ
    ...(import.meta.env.DEV ? [{ icon: IconTestPipe, label: "Sandbox", to: "/sandbox" }] : []),
];

interface NavbarLinkProps {
    icon: typeof IconHome;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip
            label={label}
            position="right"
        >
            <UnstyledButton
                onClick={onClick}
                data-active={active || undefined}
                style={{
                    width: rem(50),
                    height: rem(50),
                    borderRadius: "var(--mantine-radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: active ? "var(--mantine-color-blue-light)" : "transparent",
                    color: active
                        ? "var(--mantine-color-blue-filled)"
                        : "var(--mantine-color-text)",
                }}
            >
                <Icon
                    style={{ width: rem(20), height: rem(20) }}
                    stroke={1.5}
                />
            </UnstyledButton>
        </Tooltip>
    );
}

function UserLink() {
    const navigate = useNavigate();
    return (
        <Tooltip
            label="User Profile"
            position="right"
        >
            <UnstyledButton
                onClick={() => navigate("/users/uni_kakurenbo")}
                style={{
                    width: rem(50),
                    height: rem(50),
                    borderRadius: "var(--mantine-radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <PAvatar
                    type="user"
                    name={toBranded<UserName>("uni_kakurenbo")}
                />
            </UnstyledButton>
        </Tooltip>
    );
}

export function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const links = navItems.map(link => (
        <NavbarLink
            {...link}
            key={link.label}
            active={isActive(link.to)}
            onClick={() => navigate(link.to)}
        />
    ));

    const footerLinks = navItems.slice(1).map(link => (
        <NavbarLink
            {...link}
            key={link.label}
            active={isActive(link.to)}
            onClick={() => navigate(link.to)}
        />
    ));

    const isMobile = useMediaQuery("(max-width: 48em)");

    return (
        <AppShell
            navbar={{
                width: 80,
                breakpoint: "sm",
                collapsed: { mobile: true },
            }}
            footer={{
                height: 80,
                collapsed: !isMobile,
            }}
            padding="md"
        >
            <AppShell.Navbar
                p="md"
                visibleFrom="sm"
            >
                <Stack
                    justify="space-between"
                    h="100%"
                >
                    <Stack
                        align="center"
                        gap={0}
                    >
                        <div style={{ marginTop: rem(20), marginBottom: rem(20) }}>
                            <img
                                src={CopiaLogoSrc}
                                alt="Copia Logo"
                                style={{ width: rem(32), height: rem(32) }}
                            />
                        </div>
                        <div>
                            <Stack gap="xs">{links}</Stack>
                        </div>
                    </Stack>

                    <Stack
                        align="center"
                        gap="xs"
                    >
                        <UserLink />
                    </Stack>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Footer
                p="xs"
                hiddenFrom="sm"
            >
                <Group
                    justify="space-around"
                    h="100%"
                    align="center"
                >
                    {footerLinks.slice(0, 2)}
                    <UnstyledButton
                        onClick={() => navigate("/")}
                        style={{
                            width: rem(50),
                            height: rem(50),
                            borderRadius: "var(--mantine-radius-md)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src={CopiaLogoSrc}
                            alt="Copia Logo"
                            style={{ width: rem(32), height: rem(32) }}
                        />
                    </UnstyledButton>
                    {footerLinks.slice(2)}
                    <UserLink />
                </Group>
            </AppShell.Footer>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
