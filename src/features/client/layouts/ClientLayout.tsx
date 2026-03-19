import { Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Receipt,
  FileSignature,
} from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import type { NavItem } from "../../../types/navigation";

const clientNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/client/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "profile",
    label: "Profile",
    path: "/client/profile",
    icon: User,
  },
  {
    id: "tax-records",
    label: "Tax Records",
    path: "/client/tax-records",
    icon: FileText,
  },
  {
    id: "invoice",
    label: "Invoice",
    path: "/client/invoice",
    icon: Receipt,
  },
  {
    id: "engagement-letter",
    label: "Engagement Letter",
    path: "#",
    icon: FileSignature,
  },
];

const pageTitles: Record<string, string> = {
  "/client/dashboard": "Dashboard",
  "/client/profile": "Profile",
  "/client/tax-records": "Tax Records",
  "/client/invoice": "Invoice",
};

export default function ClientLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "";

  return (
    <MainLayout navItems={clientNavItems} pageTitle={pageTitle}>
      <Outlet />
    </MainLayout>
  );
}
