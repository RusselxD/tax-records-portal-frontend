import { Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Users, Bell, BarChart2 } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import type { NavItem } from "../../../types/navigation";

const csdNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/csd/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "tasks",
    label: "Task List",
    path: "/csd/tasks",
    icon: ClipboardList,
  },
  {
    id: "clients",
    label: "Client List",
    path: "/csd/clients",
    icon: Users,
  },
  {
    id: "analytics",
    label: "My Analytics",
    path: "/csd/analytics",
    icon: BarChart2,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/csd/notifications",
    icon: Bell,
  },
];

const pageTitles: Record<string, string> = {
  "/csd/dashboard": "Dashboard",
  "/csd/tasks": "Task List",
  "/csd/clients": "Client List",
  "/csd/analytics": "My Analytics",
  "/csd/notifications": "Notifications",
};

export default function CsdLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "";

  return (
    <MainLayout navItems={csdNavItems} pageTitle={pageTitle}>
      <Outlet />
    </MainLayout>
  );
}
