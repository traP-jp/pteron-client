import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import { theme } from "./theme";
import "./index.css";

export default function App() {
    return <MantineProvider theme={theme}>
        <ModalsProvider>
            <RouterProvider router={router}></RouterProvider>
        </ModalsProvider>
    </MantineProvider>;
}
