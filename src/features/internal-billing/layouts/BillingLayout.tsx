import { Outlet, useLocation } from "react-router-dom";
import { Users, Receipt } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import type { NavItem } from "../../../types/navigation";

const billingNavItems: NavItem[] = [
  {
    id: "clients",
    label: "Clients",
    path: "/internal-billing/clients",
    icon: Users,
  },
  {
    id: "billings",
    label: "Billings",
    path: "/internal-billing/billings",
    icon: Receipt,
  },
];

const pageTitles: Record<string, string> = {
  "/internal-billing/clients": "Billing Clients",
  "/internal-billing/billings": "Billings",
};

export default function BillingLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "";

  return (
    <MainLayout navItems={billingNavItems} pageTitle={pageTitle}>
      <Outlet />
    </MainLayout>
  );
}
