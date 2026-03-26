import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import ClientLayout from "../features/client/layouts/ClientLayout";
import ClientDashboard from "../features/client/pages/ClientDashboard";
import Profile from "../features/client/pages/Profile";
import TaxRecords from "../features/client/pages/TaxRecords";
import Invoice from "../features/client/pages/Invoice";
import InvoiceDetail from "../features/common/pages/InvoiceDetail";
import UserProfile from "../features/common/pages/UserProfile";

export const clientRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.CLIENT]} />,
  children: [
    {
      path: "/client",
      element: <ClientLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/client/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <ClientDashboard />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "tax-records",
          element: <TaxRecords />,
        },
        {
          path: "invoice",
          element: <Invoice />,
        },
        {
          path: "invoice/:id",
          element: <InvoiceDetail />,
        },
        {
          path: "account-settings",
          element: <UserProfile />,
        },
      ],
    },
  ],
};
