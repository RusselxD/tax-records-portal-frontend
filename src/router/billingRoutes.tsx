import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import BillingLayout from "../features/internal-billing/layouts/BillingLayout";
import Clients from "../features/internal-billing/pages/Clients";
import Billings from "../features/internal-billing/pages/Billings";
import CreateInvoice from "../features/internal-billing/pages/CreateInvoice";
import InvoiceDetail from "../features/common/pages/InvoiceDetail";
import UserProfile from "../features/common/pages/UserProfile";

export const billingRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.BILLING]} />,
  children: [
    {
      path: "/internal-billing",
      element: <BillingLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/internal-billing/clients" replace />,
        },
        {
          path: "clients",
          element: <Clients />,
        },
        {
          path: "billings",
          element: <Billings />,
        },
        {
          path: "billings/new",
          element: <CreateInvoice />,
        },
        {
          path: "billings/:id",
          element: <InvoiceDetail />,
        },
        {
          path: "profile",
          element: <UserProfile />,
        },
      ],
    },
  ],
};
