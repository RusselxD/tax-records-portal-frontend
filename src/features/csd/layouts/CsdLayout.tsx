import {
  LayoutDashboard,
  ClipboardList,
  ClipboardPlus,
  Users,
  Bell,
  BarChart2,
  MessageSquareText,
} from "lucide-react";
import createRoleLayout from "../../../components/layout/createRoleLayout";
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
    id: "task-requests",
    label: "Task Requests",
    path: "/csd/task-requests",
    icon: ClipboardPlus,
  },
  {
    id: "clients",
    label: "Assigned Clients",
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
    id: "consultation-logs",
    label: "Consultation Logs",
    path: "/csd/consultation-logs",
    icon: MessageSquareText,
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
  "/csd/task-requests": "Task Requests",
  "/csd/clients": "Assigned Clients",
  "/csd/analytics": "My Analytics",
  "/csd/consultation-logs": "Consultation Logs",
  "/csd/notifications": "Notifications",
  "/csd/help": "Help & Guides",
};

const CsdLayout = createRoleLayout(csdNavItems, pageTitles, "/csd/help");
export default CsdLayout;
