import { createBrowserRouter } from "react-router-dom";

import { DashboardLayout } from "./Layout";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { UserProfile } from "./pages/UserProfile";

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
