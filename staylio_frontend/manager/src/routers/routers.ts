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
    path: "/dashboard",
    Component: ManagerDashboard,
  },
  {
    path: "/branches",
    Component: ManagerHotelBranches,
  },
  {
    path: "/rooms",
    Component: ManagerRooms
  },
  {
    path: "/room-images",
    Component: ManagerRoomImages
  },
  {
    path: "/vouchers",
    Component: ManagerVoucher
  },
  {
    path: "/bookings",
    Component: ManagerBookings
  },
  {
    path: "/reviews",
    Component: ManagerReviews
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
