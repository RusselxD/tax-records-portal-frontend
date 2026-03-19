import { Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Bell,
  UserPlus,
  BarChart2,
} from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import type { NavItem } from "../../../types/navigation";

const oosNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/oos/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "tasks",
    label: "Task List",
    path: "/oos/tasks",
    icon: ClipboardList,
  },
  {
    id: "clients",
    label: "Client List",
    path: "/oos/clients",
    icon: Users,
  },
  {
    id: "client-onboarding",
    label: "Client Onboarding",
    path: "/oos/client-onboarding",
    icon: UserPlus,
  },
  {
    id: "analytics",
    label: "My Analytics",
    path: "/oos/analytics",
    icon: BarChart2,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/oos/notifications",
    icon: Bell,
  },
];

const pageTitles: Record<string, string> = {
  "/oos/dashboard": "Dashboard",
  "/oos/tasks": "Task List",
  "/oos/clients": "Client List",
  "/oos/client-onboarding": "Client Onboarding",
  "/oos/analytics": "My Analytics",
  "/oos/notifications": "Notifications",
};

export default function OosLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "";

  return (
    <MainLayout navItems={oosNavItems} pageTitle={pageTitle}>
      <Outlet />
    </MainLayout>
  );
}
