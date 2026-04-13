import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import ViewerLayout from "../features/viewer/layouts/ViewerLayout";

const ClientList = lazy(() => import("../features/common/pages/ClientList"));
const ClientDetails = lazy(() => import("../features/common/pages/ClientDetails"));
const UserProfile = lazy(() => import("../features/common/pages/UserProfile"));
const Help = lazy(() => import("../features/common/pages/Help"));

export const viewerRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.VIEWER]} />,
  children: [
    {
      path: "/viewer",
      element: <ViewerLayout />,
      children: [
        { index: true, element: <Navigate to="/viewer/clients" replace /> },
        { path: "clients", element: <ClientList /> },
        { path: "client-details/:id", element: <ClientDetails /> },
        { path: "profile", element: <UserProfile /> },
        { path: "help", element: <Help /> },
      ],
    },
  ],
};
