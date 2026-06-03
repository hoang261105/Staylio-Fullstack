import { createBrowserRouter } from "react-router-dom";
import ManagerLogin from "../pages/ManagerLogin";
import ManagerDashboard from "../pages/ManagerDashboard";
import ManagerHotelBranches from "../pages/ManagerHotelBranches";
import NotFound from "../../../common/components/NotFound";
import ManagerRooms from "../pages/ManagerRooms";
import ManagerVoucher from "../pages/ManagerVoucher";
import ManagerRoomImages from "../pages/ManagerRoomImages";
import ManagerBookings from "../pages/ManagerBookings";
import ManagerReviews from "../pages/ManagerReviews";

export const routers = createBrowserRouter([
  {
    path: "/",
    Component: ManagerLogin,
  },
  {
    path: "/manager/dashboard",
    Component: ManagerDashboard,
  },
  {
    path: "/manager/branches",
    Component: ManagerHotelBranches,
  },
  {
    path: "/manager/rooms",
    Component: ManagerRooms
  },
  {
    path: "/manager/room-images",
    Component: ManagerRoomImages
  },
  {
    path: "/manager/vouchers",
    Component: ManagerVoucher
  },
  {
    path: "/manager/bookings",
    Component: ManagerBookings
  },
  {
    path: "/manager/reviews",
    Component: ManagerReviews
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
