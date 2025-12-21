import { Avatar, Text, Tooltip, createTheme } from "@mantine/core";

import textClasses from "/@/styles/p-amount.module.scss";
import avatarClasses from "/@/styles/p-avatar.module.scss";

const fontStack =
    "'M PLUS 1', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const theme = createTheme({
    fontFamily: fontStack,
    headings: { fontFamily: fontStack },
    components: {
        Avatar: Avatar.extend({ classNames: avatarClasses }),
        Text: Text.extend({ classNames: textClasses }),
        Tooltip: Tooltip.extend({
            vars: () => ({
                tooltip: {
                    "--tooltip-bg":
                        "light-dark(var(--mantine-color-gray-9), var(--mantine-color-dark-5))",
                    "--tooltip-color": "var(--mantine-color-white)",
                },
            }),
        }),
    },
});
