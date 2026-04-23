import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import CsdLayout from "../features/csd/layouts/CsdLayout";

const Dashboard = lazy(() => import("../features/common/pages/AccountantDashboard"));
const TaxRecordTasks = lazy(() => import("../features/common/pages/TaxRecordTasks"));
const ClientList = lazy(() => import("../features/common/pages/ClientList"));
const Notifications = lazy(() => import("../features/common/pages/Notifications"));
const ClientInfoView = lazy(() => import("../features/common/pages/ClientDetails"));
const TaxRecordTaskDetails = lazy(() => import("../features/common/pages/TaxRecordTaskDetails"));
const UserProfile = lazy(() => import("../features/common/pages/UserProfile"));
const AccountantAnalytics = lazy(() => import("../features/common/pages/AccountantAnalytics"));
const EditClientProfile = lazy(() => import("../features/common/pages/EditClientProfile"));
const ProfileUpdateReview = lazy(() => import("../features/common/pages/ProfileUpdateReview"));
const ConsultationLogs = lazy(() => import("../features/common/pages/ConsultationLogs"));
const ConsultationLogDetail = lazy(() => import("../features/common/pages/ConsultationLogDetail"));
const Help = lazy(() => import("../features/common/pages/Help"));
const TaxRecordTaskRequests = lazy(() => import("../features/common/pages/TaxRecordTaskRequests"));
const TaxRecordTaskRequestDetails = lazy(() => import("../features/common/pages/TaxRecordTaskRequestDetails"));

export const csdRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.CSD]} />,
  children: [
    {
      path: "/csd",
      element: <CsdLayout />,
      children: [
        { index: true, element: <Navigate to="/csd/dashboard" replace /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "tasks", element: <TaxRecordTasks title="My Tasks" /> },
        { path: "clients", element: <ClientList /> },
        { path: "client-details/:id", element: <ClientInfoView /> },
        { path: "client-edit/:id", element: <EditClientProfile /> },
        { path: "profile-update-review/:id", element: <ProfileUpdateReview /> },
        { path: "tax-record-task/:id", element: <TaxRecordTaskDetails /> },
        { path: "task-requests", element: <TaxRecordTaskRequests /> },
        { path: "task-requests/:id", element: <TaxRecordTaskRequestDetails /> },
        { path: "consultation-logs", element: <ConsultationLogs /> },
        { path: "consultation-logs/:id", element: <ConsultationLogDetail /> },
        { path: "notifications", element: <Notifications /> },
        { path: "analytics", element: <AccountantAnalytics /> },
        { path: "profile", element: <UserProfile /> },
        { path: "help", element: <Help /> },
      ],
    },
  ],
};
