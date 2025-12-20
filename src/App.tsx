import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

import "./index.css";
import { router } from "./router";
import { theme } from "./theme";

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <Notifications position="bottom-left" />
            <ModalsProvider>
                <Suspense>
                    <RouterProvider router={router} />
                </Suspense>
            </ModalsProvider>
        </MantineProvider>
    );
}
