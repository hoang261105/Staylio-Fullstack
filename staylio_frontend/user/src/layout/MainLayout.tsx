import { Outlet, useLocation } from "react-router-dom";
import ChatBotWidget from "../components/ChatBotWidget";

export default function MainLayout() {
    const location = useLocation();

    const hideChatRoutes = [
        "/login",
        "/register",
        "/verify-email",
        "/forgot-password",
        "/reset-password",
    ];

    const shouldHideChat = hideChatRoutes.some((route) =>
        location.pathname.startsWith(route)
    );

    return (
        <div className="min-h-screen">
            <Outlet />

            {!shouldHideChat && <ChatBotWidget />}
        </div>
    );
}