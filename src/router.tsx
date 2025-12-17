import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { DashboardLayout } from "./Layout";

const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const Checkout = lazy(() =>
    import("./pages/Checkout").then(module => ({ default: module.Checkout }))
);
const UserProfile = lazy(() =>
    import("./pages/UserProfile").then(module => ({ default: module.UserProfile }))
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "users/:userId",
                element: <UserProfile />,
            },
        ],
    },
    {
        path: "/checkout",
        element: <Checkout />,
    },
]);
