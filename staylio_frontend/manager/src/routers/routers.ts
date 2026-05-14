import { createBrowserRouter } from "react-router-dom";
import ManagerLogin from "../pages/ManagerLogin";
import ManagerDashboard from "../pages/ManagerDashboard";
import ManagerHotelBranches from "../pages/ManagerHotelBranches";
import NotFound from "../../../common/components/NotFound";
import ManagerRooms from "../pages/ManagerRooms";

export const routers = createBrowserRouter([
  {
    path: "/login",
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
    path: "*",
    Component: NotFound,
  },
]);
