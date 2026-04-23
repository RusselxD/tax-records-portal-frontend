import { LayoutDashboard, Users, ListTodo, Bell, UserCheck, MessageSquareText, ClipboardList } from "lucide-react";
import createRoleLayout from "../../../components/layout/createRoleLayout";
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
    label: "Assigned Clients",
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
    id: "task-requests",
    label: "Task Requests",
    path: "/qtd/task-requests",
    icon: ClipboardList,
  },
  {
    id: "consultation-logs",
    label: "Consultation Logs",
    path: "/qtd/consultation-logs",
    icon: MessageSquareText,
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
  "/qtd/clients": "Assigned Clients",
  "/qtd/client-profiles": "Client Profiles",
  "/qtd/tasks": "Task Management",
  "/qtd/task-requests": "Task Requests",
  "/qtd/consultation-logs": "Consultation Logs",
  "/qtd/notifications": "Notifications",
  "/qtd/help": "Help & Guides",
};

const QtdLayout = createRoleLayout(qtdNavItems, pageTitles, "/qtd/help");
export default QtdLayout;
