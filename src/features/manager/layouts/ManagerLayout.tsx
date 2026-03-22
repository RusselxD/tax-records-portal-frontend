import { Outlet, useLocation, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Building2,
  ClipboardList,
  UserCheck,
  Bell,
  HelpCircle,
} from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import type { NavItem } from "../../../types/navigation";

const managerNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/manager/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    label: "User Management",
    path: "/manager/users",
    icon: Users,
  },
  {
    id: "analytics",
    label: "Accountant Analytics",
    path: "/manager/analytics",
    icon: BarChart3,
  },
  {
    id: "clients",
    label: "Client List",
    path: "/manager/clients",
    icon: Building2,
  },
  {
    id: "client-profiles",
    label: "Client Profiles",
    path: "/manager/client-profiles",
    icon: UserCheck,
  },
  {
    id: "tasks",
    label: "Task Overview",
    path: "/manager/tasks",
    icon: ClipboardList,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/manager/notifications",
    icon: Bell,
  },
];

const pageTitles: Record<string, string> = {
  "/manager/dashboard": "Dashboard",
  "/manager/users": "User Management",
  "/manager/analytics": "Accountant Analytics",
  "/manager/clients": "Client List",
  "/manager/client-profiles": "Client Profiles",
  "/manager/tasks": "Task Overview",
  "/manager/client-template": "Client Info Template",
  "/manager/help": "Help & Guides",
};

const HelpLink = () => (
  <NavLink
    to="/manager/help"
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-accent text-primary"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`
    }
  >
    <HelpCircle className="w-4 h-4" />
    <span>Help & Guides</span>
  </NavLink>
);

export default function ManagerLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "";

  return (
    <MainLayout
      navItems={managerNavItems}
      pageTitle={pageTitle}
      sidebarBottomAction={<HelpLink />}
    >
      <Outlet />
    </MainLayout>
  );
}
