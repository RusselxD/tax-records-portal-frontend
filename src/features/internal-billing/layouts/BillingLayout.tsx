import { Users, Receipt } from "lucide-react";
import createRoleLayout from "../../../components/layout/createRoleLayout";
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
  "/internal-billing/help": "Help & Guides",
};

const BillingLayout = createRoleLayout(billingNavItems, pageTitles, "/internal-billing/help");
export default BillingLayout;
