import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import ManagerLayout from "../features/manager/layouts/ManagerLayout";
import AdminDashboard from "../features/manager/pages/AdminDashboard/AdminDashboard";
import UserManagement from "../features/manager/pages/UserManagement";
import AccountantAnalytics from "../features/manager/pages/AccountantAnalytics";
import ClientList from "../features/common/pages/ClientList";
import TaxRecordTasks from "../features/common/pages/TaxRecordTasks";
import ClientInfoReview from "../features/common/pages/ClientOnboardingPreview";
import ClientInfoView from "../features/common/pages/ClientDetails";
import TaxRecordTaskDetails from "../features/common/pages/TaxRecordTaskDetails";
import ClientProfiles from "../features/common/pages/ClientProfiles";
import UserProfile from "../features/common/pages/UserProfile";
import EditClientProfile from "../features/common/pages/EditClientProfile";
import ProfileUpdateReview from "../features/common/pages/ProfileUpdateReview";
import Notifications from "../features/common/pages/Notifications";

export const managerRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.MANAGER]} />,
  children: [
    {
      path: "/manager",
      element: <ManagerLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/manager/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "users",
          element: <UserManagement />,
        },
        {
          path: "analytics",
          element: <AccountantAnalytics />,
        },
        {
          path: "clients",
          element: <ClientList />,
        },
        {
          path: "client-profiles",
          element: <ClientProfiles />,
        },
        {
          path: "tasks",
          element: <TaxRecordTasks />,
        },
        {
          path: "client-preview/:id",
          element: <ClientInfoReview />,
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
          path: "profile",
          element: <UserProfile />,
        },
      ],
    },
  ],
};
