import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import QtdLayout from "../features/qtd/layouts/QtdLayout";
import QtdDashboard from "../features/qtd/pages/QtdDashboard";
import ClientList from "../features/common/pages/ClientList";
import Notifications from "../features/common/pages/Notifications";
import TaxRecordTasks from "../features/common/pages/TaxRecordTasks";
import ClientInfoReview from "../features/common/pages/ClientOnboardingPreview";
import ClientInfoView from "../features/common/pages/ClientDetails";
import TaxRecordTaskDetails from "../features/common/pages/TaxRecordTaskDetails";
import UserProfile from "../features/common/pages/UserProfile";
import ClientProfiles from "../features/common/pages/ClientProfiles";
import ProfileUpdateReview from "../features/common/pages/ProfileUpdateReview";

export const qtdRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.QTD]} />,
  children: [
    {
      path: "/qtd",
      element: <QtdLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/qtd/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <QtdDashboard />,
        },
        {
          path: "tasks",
          element: <TaxRecordTasks title="Task Management" />,
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
          path: "client-preview/:id",
          element: <ClientInfoReview />,
        },
        {
          path: "client-details/:id",
          element: <ClientInfoView />,
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
