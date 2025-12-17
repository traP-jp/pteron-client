import { Avatar, createTheme } from "@mantine/core";

import avatarClasses from "/@/styles/p-avater.module.scss";

export const theme = createTheme({
    components: {
        Avatar: Avatar.extend({ classNames: avatarClasses }),
    },
});
