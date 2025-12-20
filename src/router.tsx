import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: lazy(() => import("./Layout")),
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
                children: [
                    {
                        index: true,
                        element: (
                            <Navigate
                                to="users"
                                replace
                            />
                        ),
                    },
                    {
                        path: "users",
                        Component: lazy(() => import("./pages/UserStats")),
                    },
                    {
                        path: "users/:rankingName",
                        Component: lazy(() => import("./pages/UserStatsDetail")),
                    },
                    {
                        path: "projects",
                        Component: lazy(() => import("./pages/ProjectStats")),
                    },
                    {
                        path: "projects/:rankingName",
                        Component: lazy(() => import("./pages/ProjectStatsDetail")),
                    },
                ],
            },
            // 開発環境のみsandboxを追加
            ...(import.meta.env.DEV
                ? [
                      {
                          path: "sandbox",
                          Component: lazy(() => import("./pages/Sandbox")),
                      },
                  ]
                : []),
        ],
    },
    {
        path: "/checkout",
        Component: lazy(() => import("./pages/Checkout")),
    },
]);
