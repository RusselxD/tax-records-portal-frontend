import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import CsdLayout from "../features/csd/layouts/CsdLayout";
import Dashboard from "../features/common/pages/AccountantDashboard";
import TaxRecordTasks from "../features/common/pages/TaxRecordTasks";
import ClientList from "../features/common/pages/ClientList";
import Notifications from "../features/common/pages/Notifications";
import ClientInfoView from "../features/common/pages/ClientDetails";
import TaxRecordTaskDetails from "../features/common/pages/TaxRecordTaskDetails";
import UserProfile from "../features/common/pages/UserProfile";
import AccountantAnalytics from "../features/common/pages/AccountantAnalytics";
import EditClientProfile from "../features/common/pages/EditClientProfile";
import ProfileUpdateReview from "../features/common/pages/ProfileUpdateReview";

export const csdRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.CSD]} />,
  children: [
    {
      path: "/csd",
      element: <CsdLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/csd/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "tasks",
          element: <TaxRecordTasks title="My Tasks" />,
        },
        {
          path: "clients",
          element: <ClientList />,
        },
        {
          path: "client-details/:id",
          element: <ClientInfoView />,
        },
        {
          path: "client-edit/:id",
          element: <EditClientProfile />,
        },
        {
          path: "profile-update-review/:id",
          element: <ProfileUpdateReview />,
        },
        {
          path: "tax-record-task/:id",
          element: <TaxRecordTaskDetails />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
        {
          path: "analytics",
          element: <AccountantAnalytics />,
        },
        {
          path: "profile",
          element: <UserProfile />,
        },
      ],
    },
  ],
};
