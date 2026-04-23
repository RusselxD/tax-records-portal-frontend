import {
  LayoutDashboard,
  Users,
  BarChart3,
  Building2,
  ClipboardList,
  ClipboardPlus,
  UserCheck,
  Bell,
  MessageSquareText,
} from "lucide-react";
import createRoleLayout from "../../../components/layout/createRoleLayout";
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
    id: "task-requests",
    label: "Task Requests",
    path: "/manager/task-requests",
    icon: ClipboardPlus,
  },
  {
    id: "consultation-logs",
    label: "Consultation Logs",
    path: "/manager/consultation-logs",
    icon: MessageSquareText,
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
  "/manager/task-requests": "Task Requests",
  "/manager/consultation-logs": "Consultation Logs",
  "/manager/client-template": "Client Info Template",
  "/manager/help": "Help & Guides",
};

const ManagerLayout = createRoleLayout(managerNavItems, pageTitles, "/manager/help");
export default ManagerLayout;
