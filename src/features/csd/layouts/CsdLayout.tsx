import { Outlet, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Bell,
  BarChart2,
  HelpCircle,
} from "lucide-react";
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
  "/csd/help": "Help & Guides",
};

const HelpLink = () => (
  <NavLink
    to="/csd/help"
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

export default function CsdLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "";

  return (
    <MainLayout
      navItems={csdNavItems}
      pageTitle={pageTitle}
      sidebarBottomAction={<HelpLink />}
    >
      <Outlet />
    </MainLayout>
  );
}
