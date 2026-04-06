import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import QtdLayout from "../features/qtd/layouts/QtdLayout";

const QtdDashboard = lazy(() => import("../features/qtd/pages/QtdDashboard"));
const ClientList = lazy(() => import("../features/common/pages/ClientList"));
const Notifications = lazy(() => import("../features/common/pages/Notifications"));
const TaxRecordTasks = lazy(() => import("../features/common/pages/TaxRecordTasks"));
const ClientInfoReview = lazy(() => import("../features/common/pages/ClientOnboardingPreview"));
const ClientInfoView = lazy(() => import("../features/common/pages/ClientDetails"));
const TaxRecordTaskDetails = lazy(() => import("../features/common/pages/TaxRecordTaskDetails"));
const UserProfile = lazy(() => import("../features/common/pages/UserProfile"));
const ClientProfiles = lazy(() => import("../features/common/pages/ClientProfiles"));
const ProfileUpdateReview = lazy(() => import("../features/common/pages/ProfileUpdateReview"));
const ConsultationLogs = lazy(() => import("../features/common/pages/ConsultationLogs"));
const ConsultationLogDetail = lazy(() => import("../features/common/pages/ConsultationLogDetail"));
const Help = lazy(() => import("../features/common/pages/Help"));

export const qtdRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.QTD]} />,
  children: [
    {
      path: "/qtd",
      element: <QtdLayout />,
      children: [
        { index: true, element: <Navigate to="/qtd/dashboard" replace /> },
        { path: "dashboard", element: <QtdDashboard /> },
        { path: "tasks", element: <TaxRecordTasks title="Task Management" /> },
        { path: "clients", element: <ClientList /> },
        { path: "client-profiles", element: <ClientProfiles /> },
        { path: "client-preview/:id", element: <ClientInfoReview /> },
        { path: "client-details/:id", element: <ClientInfoView /> },
        { path: "profile-update-review/:id", element: <ProfileUpdateReview /> },
        { path: "tax-record-task/:id", element: <TaxRecordTaskDetails /> },
        { path: "consultation-logs", element: <ConsultationLogs /> },
        { path: "consultation-logs/:id", element: <ConsultationLogDetail /> },
        { path: "notifications", element: <Notifications /> },
        { path: "profile", element: <UserProfile /> },
        { path: "help", element: <Help /> },
      ],
    },
  ],
};
