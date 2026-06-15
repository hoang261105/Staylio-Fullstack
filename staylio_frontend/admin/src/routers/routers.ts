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
import AdminVouchers from "../pages/AdminVouchers";
import AdminBookings from "../pages/AdminBookings";
import AdminReviews from "../pages/AdminReviews";
import NotificationsPage from "../pages/NotificationsPage";

export const routers = createBrowserRouter([
    {
        path: "/",
        Component: AdminLogin
    },
    {
        path: "/dashboard",
        Component: Dashboard
    },
    {
        path: "/customers",
        Component: AdminCustomers
    },
    {
        path: "/hotels",
        Component: AdminHotels
    },
    {
        path: "/hotel-branches",
        Component: AdminHotelBranches
    },
    {
        path: "/rooms",
        Component: AdminRooms
    },
    {
        path: "/room-images",
        Component: AdminRoomImages
    },
    {
        path: "/room-images/detail/:id",
        Component: AdminRoomImageDetail
    },
    {
        path: "/utilities",
        Component: AdminUtilities
    },
    {
        path: "/vouchers",
        Component: AdminVouchers
    },
    {
        path: "/bookings",
        Component: AdminBookings
    },
    {
        path: "/reviews",
        Component: AdminReviews
    },
    {
        path: "/notifications",
        Component: NotificationsPage
    },
    {
        path: "*",
        Component: NotFound
    }
])