import { createBrowserRouter, Navigate } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Protected from "../features/auth/components/Protected";
import Dashboard from "../features/chat/pages/Dashboard.jsx";
import CheckEmail from "../features/auth/pages/CheckEmail.jsx";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/",
        element: <Protected>
            <Dashboard/>
        </Protected>
    },
    {
        path: "/dashboard",
        element: <Navigate to="/" replace/>
    },
    {
        path: "/check-email",
        element: <CheckEmail/>
    }
])