import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { UserProfile } from "./pages/UserProfile";
import { Checkout } from "./pages/Checkout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "users/:userId",
        element: <UserProfile />,
    },
    {
        path: "/checkout",
        element: <Checkout />,
    }
]);