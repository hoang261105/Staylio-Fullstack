import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import ChangePassword from "../pages/ChangePassword";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import NotFound from "../../../common/components/NotFound";
import BranchDetails from "../pages/BranchDetails";
import SearchRooms from "../pages/SearchRooms";
import RoomDetail from "../pages/RoomDetail";
import BookingConfirmation from "../pages/BookingConfirmation";
import BookingHistory from "../pages/BookingHistory";
import RoomReviews from "../pages/RoomReviews";
import LocationBranches from "../pages/LocationBranches";
import { LocationsPage } from "../pages/LocationsPage";
import BranchesPage from "../pages/BranchesPage";
import HotelsPage from "../pages/HotelsPage";
import NotificationsPage from "../pages/NotificationsPage";

export const routers = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/search",
    Component: SearchRooms,
  },
  {
    path: "/locations",
    Component: LocationsPage,
  },
  {
    path: "/branches",
    Component: BranchesPage,
  },
  {
    path: "/hotels",
    Component: HotelsPage,
  },
  {
    path: "/location/:provinceId",
    Component: LocationBranches,
  },
  {
    path: "/hotel/:hotelId/branch/:branchId",
    Component: BranchDetails,
  },
  {
    path: "/hotel/:hotelId/branch/:branchId/room/:roomId",
    Component: RoomDetail,
  },
  {
    path: "/hotel/:hotelId/branch/:branchId/room/:roomId/reviews",
    Component: RoomReviews,
  },
  {
    path: "/booking/confirmation",
    Component: BookingConfirmation,
  },
  {
    path: "/profile/me",
    Component: Profile,
  },
  {
    path: "/booking-history",
    Component: BookingHistory
  },
  {
    path: "/profile/edit",
    Component: EditProfile,
  },
  {
    path: "/change-password",
    Component: ChangePassword,
  },
  {
    path: "/notifications",
    Component: NotificationsPage,
  },
  {
    path: "*",
    Component: NotFound,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/verify-email",
    Component: VerifyEmail,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
]);
