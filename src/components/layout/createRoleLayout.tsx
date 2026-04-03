/* eslint-disable react-refresh/only-export-components */
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { Download, HelpCircle } from "lucide-react";
import MainLayout from "./MainLayout";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import type { NavItem } from "../../types/navigation";

function SidebarBottomActions({ helpPath }: { helpPath: string }) {
  const { canInstall, install } = usePwaInstall();

  return (
    <div className="space-y-1">
      {canInstall && (
        <button
          onClick={install}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-white/70 hover:bg-white/10 hover:text-white w-full"
        >
          <Download className="w-4 h-4" />
          <span>Install App</span>
        </button>
      )}
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
    </div>
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
        sidebarBottomAction={<SidebarBottomActions helpPath={helpPath} />}
      >
        <Outlet />
      </MainLayout>
    );
  }

  return RoleLayout;
}
