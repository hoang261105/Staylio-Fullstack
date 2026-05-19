import { createBrowserRouter } from "react-router-dom";
import AdminLogin from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AdminCustomers from "../pages/AdminCustomers";
import AdminHotels from "../pages/AdminHotels";
import AdminHotelBranches from "../pages/AdminHotelBranches";
import AdminRooms from "../pages/AdminRooms";
import NotFound from "../../../common/components/NotFound";
import AdminUtilities from "../pages/AdminUtilities";
import AdminRoomImages from "../pages/AdminRoomImages";
import AdminRoomImageDetail from "../components/room-images/AdminRoomImageDetail";

export const routers = createBrowserRouter([
    {
        path: "/admin/login",
        Component: AdminLogin
    },
    {
        path: "/admin/dashboard",
        Component: Dashboard
    },
    {
        path: "/admin/customers",
        Component: AdminCustomers
    },
    {
        path: "/admin/hotels",
        Component: AdminHotels
    },
    {
        path: "/admin/hotel-branches",
        Component: AdminHotelBranches
    },
    {
        path: "/admin/rooms",
        Component: AdminRooms
    },
    {
        path: "/admin/room-images",
        Component: AdminRoomImages
    },
    {
        path: "/admin/room-images/detail/:id",
        Component: AdminRoomImageDetail
    },
    {
        path: "/admin/utilities",
        Component: AdminUtilities
    },
    {
        path: "*",
        Component: NotFound
    }
])