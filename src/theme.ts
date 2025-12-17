import { Avatar, createTheme } from "@mantine/core";

import avatarClasses from "/@/styles/p-avater.module.scss";

const fontStack =
    "'M PLUS 1', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const theme = createTheme({
    fontFamily: fontStack,
    headings: { fontFamily: fontStack },
    components: {
        Avatar: Avatar.extend({ classNames: avatarClasses }),
    },
});
