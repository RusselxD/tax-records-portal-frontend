import { Users } from "lucide-react";
import createRoleLayout from "../../../components/layout/createRoleLayout";
import type { NavItem } from "../../../types/navigation";

const viewerNavItems: NavItem[] = [
  {
    id: "clients",
    label: "Client List",
    path: "/viewer/clients",
    icon: Users,
  },
];

const pageTitles: Record<string, string> = {
  "/viewer/clients": "Client List",
  "/viewer/help": "Help & Guides",
};

const ViewerLayout = createRoleLayout(viewerNavItems, pageTitles, "/viewer/help");
export default ViewerLayout;
