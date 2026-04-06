import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import ManagerLayout from "../features/manager/layouts/ManagerLayout";

const AdminDashboard = lazy(() => import("../features/manager/pages/AdminDashboard/AdminDashboard"));
const UserManagement = lazy(() => import("../features/manager/pages/UserManagement"));
const AccountantAnalytics = lazy(() => import("../features/manager/pages/AccountantAnalytics"));
const AccountantDetail = lazy(() => import("../features/manager/pages/AccountantAnalytics/AccountantDetail"));
const ClientList = lazy(() => import("../features/common/pages/ClientList"));
const TaxRecordTasks = lazy(() => import("../features/common/pages/TaxRecordTasks"));
const ClientInfoReview = lazy(() => import("../features/common/pages/ClientOnboardingPreview"));
const ClientInfoView = lazy(() => import("../features/common/pages/ClientDetails"));
const TaxRecordTaskDetails = lazy(() => import("../features/common/pages/TaxRecordTaskDetails"));
const ClientProfiles = lazy(() => import("../features/common/pages/ClientProfiles"));
const UserProfile = lazy(() => import("../features/common/pages/UserProfile"));
const EditClientProfile = lazy(() => import("../features/common/pages/EditClientProfile"));
const ProfileUpdateReview = lazy(() => import("../features/common/pages/ProfileUpdateReview"));
const Notifications = lazy(() => import("../features/common/pages/Notifications"));
const InvoiceDetail = lazy(() => import("../features/common/pages/InvoiceDetail"));
const ConsultationLogs = lazy(() => import("../features/common/pages/ConsultationLogs"));
const ConsultationLogDetail = lazy(() => import("../features/common/pages/ConsultationLogDetail"));
const Help = lazy(() => import("../features/common/pages/Help"));

export const managerRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.MANAGER]} />,
  children: [
    {
      path: "/manager",
      element: <ManagerLayout />,
      children: [
        { index: true, element: <Navigate to="/manager/dashboard" replace /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "users", element: <UserManagement /> },
        { path: "analytics", element: <AccountantAnalytics /> },
        { path: "accountant-analytics/:id", element: <AccountantDetail /> },
        { path: "clients", element: <ClientList /> },
        { path: "client-profiles", element: <ClientProfiles /> },
        { path: "tasks", element: <TaxRecordTasks /> },
        { path: "client-preview/:id", element: <ClientInfoReview /> },
        { path: "client-details/:id", element: <ClientInfoView /> },
        { path: "client-edit/:id", element: <EditClientProfile /> },
        { path: "profile-update-review/:id", element: <ProfileUpdateReview /> },
        { path: "tax-record-task/:id", element: <TaxRecordTaskDetails /> },
        { path: "billings/:id", element: <InvoiceDetail /> },
        { path: "consultation-logs", element: <ConsultationLogs /> },
        { path: "consultation-logs/:id", element: <ConsultationLogDetail /> },
        { path: "notifications", element: <Notifications /> },
        { path: "profile", element: <UserProfile /> },
        { path: "help", element: <Help /> },
      ],
    },
  ],
};
