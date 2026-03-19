import { Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ListTodo, Bell, UserCheck } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import type { NavItem } from "../../../types/navigation";

const qtdNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/qtd/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "clients",
    label: "Client List",
    path: "/qtd/clients",
    icon: Users,
  },
  {
    id: "client-profiles",
    label: "Client Profiles",
    path: "/qtd/client-profiles",
    icon: UserCheck,
  },
  {
    id: "tasks",
    label: "Task Management",
    path: "/qtd/tasks",
    icon: ListTodo,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/qtd/notifications",
    icon: Bell,
  },
];

const pageTitles: Record<string, string> = {
  "/qtd/dashboard": "Dashboard",
  "/qtd/clients": "Client List",
  "/qtd/client-profiles": "Client Profiles",
  "/qtd/tasks": "Task Management",
  "/qtd/notifications": "Notifications",
};

export default function QtdLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "";

  return (
    <MainLayout
      navItems={qtdNavItems}
      pageTitle={pageTitle}
    >
      <Outlet />
    </MainLayout>
  );
}
