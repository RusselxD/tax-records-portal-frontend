import {
  LayoutDashboard,
  ClipboardList,
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
  "/csd/clients": "Client List",
  "/csd/analytics": "My Analytics",
  "/csd/consultation-logs": "Consultation Logs",
  "/csd/notifications": "Notifications",
  "/csd/help": "Help & Guides",
};

const CsdLayout = createRoleLayout(csdNavItems, pageTitles, "/csd/help");
export default CsdLayout;
