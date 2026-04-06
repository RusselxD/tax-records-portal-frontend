import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import ClientLayout from "../features/client/layouts/ClientLayout";

const ClientDashboard = lazy(() => import("../features/client/pages/ClientDashboard"));
const Profile = lazy(() => import("../features/client/pages/Profile"));
const TaxRecords = lazy(() => import("../features/client/pages/TaxRecords"));
const Invoice = lazy(() => import("../features/client/pages/Invoice"));
const InvoiceDetail = lazy(() => import("../features/common/pages/InvoiceDetail"));
const UserProfile = lazy(() => import("../features/common/pages/UserProfile"));

export const clientRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.CLIENT]} />,
  children: [
    {
      path: "/client",
      element: <ClientLayout />,
      children: [
        { index: true, element: <Navigate to="/client/dashboard" replace /> },
        { path: "dashboard", element: <ClientDashboard /> },
        { path: "profile", element: <Profile /> },
        { path: "tax-records", element: <TaxRecords /> },
        { path: "invoice", element: <Invoice /> },
        { path: "invoice/:id", element: <InvoiceDetail /> },
        { path: "account-settings", element: <UserProfile /> },
      ],
    },
  ],
};
