import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Bell,
  UserPlus,
  UserMinus,
  BarChart2,
  MessageSquareText,
} from "lucide-react";
import createRoleLayout from "../../../components/layout/createRoleLayout";
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
    id: "client-offboarding",
    label: "Client Offboarding",
    path: "/oos/client-offboarding",
    icon: UserMinus,
  },
  {
    id: "analytics",
    label: "My Analytics",
    path: "/oos/analytics",
    icon: BarChart2,
  },
  {
    id: "consultation-logs",
    label: "Consultation Logs",
    path: "/oos/consultation-logs",
    icon: MessageSquareText,
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
  "/oos/client-offboarding": "Client Offboarding",
  "/oos/analytics": "My Analytics",
  "/oos/consultation-logs": "Consultation Logs",
  "/oos/notifications": "Notifications",
  "/oos/help": "Help & Guides",
};

const OosLayout = createRoleLayout(oosNavItems, pageTitles, "/oos/help");
export default OosLayout;
