import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { DashboardLayout } from "./Layout";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: DashboardLayout,
        children: [
            {
                path: "",
                Component: lazy(() => import("./pages/Home")),
            },
            {
                path: "users",
                Component: lazy(() => import("./pages/Users")),
            },
            {
                path: "users/:userId",
                Component: lazy(() => import("./pages/UserProfile")),
            },
            {
                path: "projects",
                Component: lazy(() => import("./pages/Projects")),
            },
            {
                path: "projects/:projectId",
                Component: lazy(() => import("./pages/ProjectDetails")),
            },
            {
                path: "stats",
                Component: lazy(() => import("./pages/Stats")),
            },
        ],
    },
    {
        path: "/checkout",
        Component: lazy(() => import("./pages/Checkout")),
    },
]);
