import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { RoleGuard } from "../guards";
import { UserRole } from "../constants";
import BillingLayout from "../features/internal-billing/layouts/BillingLayout";

const Clients = lazy(() => import("../features/internal-billing/pages/Clients"));
const Billings = lazy(() => import("../features/internal-billing/pages/Billings"));
const CreateInvoice = lazy(() => import("../features/internal-billing/pages/CreateInvoice"));
const InvoiceDetail = lazy(() => import("../features/common/pages/InvoiceDetail"));
const UserProfile = lazy(() => import("../features/common/pages/UserProfile"));
const Help = lazy(() => import("../features/common/pages/Help"));

export const billingRoutes: RouteObject = {
  element: <RoleGuard allowedRoles={[UserRole.BILLING]} />,
  children: [
    {
      path: "/internal-billing",
      element: <BillingLayout />,
      children: [
        { index: true, element: <Navigate to="/internal-billing/clients" replace /> },
        { path: "clients", element: <Clients /> },
        { path: "billings", element: <Billings /> },
        { path: "billings/new", element: <CreateInvoice /> },
        { path: "billings/:id", element: <InvoiceDetail /> },
        { path: "profile", element: <UserProfile /> },
        { path: "help", element: <Help /> },
      ],
    },
  ],
};
