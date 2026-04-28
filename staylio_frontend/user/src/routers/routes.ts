import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const routers = createBrowserRouter([
    {
        path: "/",
        Component: Home
    },
    {
        path: "/login",
        Component: Login
    },
    {
        path: "/register",
        Component: Register
    }
])