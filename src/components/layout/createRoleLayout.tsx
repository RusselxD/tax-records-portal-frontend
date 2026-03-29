/* eslint-disable react-refresh/only-export-components */
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import MainLayout from "./MainLayout";
import type { NavItem } from "../../types/navigation";

function HelpLink({ helpPath }: { helpPath: string }) {
  return (
    <NavLink
      to={helpPath}
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
}

export default function createRoleLayout(
  navItems: NavItem[],
  pageTitles: Record<string, string>,
  helpPath: string
) {
  function RoleLayout() {
    const location = useLocation();
    const pageTitle = pageTitles[location.pathname] || "";

    return (
      <MainLayout
        navItems={navItems}
        pageTitle={pageTitle}
        sidebarBottomAction={<HelpLink helpPath={helpPath} />}
      >
        <Outlet />
      </MainLayout>
    );
  }

  return RoleLayout;
}
