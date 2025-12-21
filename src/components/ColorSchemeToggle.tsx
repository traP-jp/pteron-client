import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

/**
 * Light/Dark テーマ切り替えトグル
 * 初期値はブラウザ設定（Auto）に追従、切り替え後は明示的に保存
 */
export function ColorSchemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme("light", {
        getInitialValueInEffect: true,
    });

    const isDark = computedColorScheme === "dark";

    const toggleColorScheme = () => {
        setColorScheme(isDark ? "light" : "dark");
    };

    return (
        <Tooltip
            label={isDark ? "ライトモード" : "ダークモード"}
            position="right"
        >
            <ActionIcon
                onClick={toggleColorScheme}
                variant="subtle"
                color="gray"
                size="lg"
                aria-label="Toggle color scheme"
            >
                {isDark ? (
                    <IconSun
                        size={20}
                        stroke={1.5}
                    />
                ) : (
                    <IconMoon
                        size={20}
                        stroke={1.5}
                    />
                )}
            </ActionIcon>
        </Tooltip>
    );
}
