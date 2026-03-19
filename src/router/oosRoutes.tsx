import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import OosLayout from "../features/oos/layouts/OosLayout";
import Dashboard from "../features/common/pages/AccountantDashboard";
import TaxRecordTasks from "../features/common/pages/TaxRecordTasks";
import ClientList from "../features/common/pages/ClientList";
import Notifications from "../features/common/pages/Notifications";
import ClientOnboarding from "../features/oos/pages/ClientOnboarding";
import NewClient from "../features/oos/pages/NewClient";
import ClientInfoReview from "../features/common/pages/ClientOnboardingPreview";
import ClientInfoView from "../features/common/pages/ClientDetails";
import TaxRecordTaskDetails from "../features/common/pages/TaxRecordTaskDetails";
import UserProfile from "../features/common/pages/UserProfile";
import AccountantAnalytics from "../features/common/pages/AccountantAnalytics";
import EditClientProfile from "../features/common/pages/EditClientProfile";
import ProfileUpdateReview from "../features/common/pages/ProfileUpdateReview";

export const oosRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.OOS]} />,
  children: [
    {
      path: "/oos",
      element: <OosLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/oos/dashboard" replace />,
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
          path: "client-onboarding",
          element: <ClientOnboarding />,
        },
        {
          path: "new-client",
          element: <NewClient />,
        },
        {
          path: "new-client/:id",
          element: <NewClient />,
        },
        {
          path: "client-preview/:id",
          element: <ClientInfoReview />,
        },
        {
          path: "client-snapshot/:id",
          element: <ClientInfoView mode="snapshot" />,
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
