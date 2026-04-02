import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import type { NavItem } from "../../types/navigation";

interface MainLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  pageTitle: string;
  sidebarBottomAction?: ReactNode;
}

const ContentContainer = ({ children }: { children: ReactNode }) => (
  <div className="px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-7">
    <div className="mx-auto">{children}</div>
  </div>
);

export default function MainLayout({
  children,
  navItems,
  pageTitle,
  sidebarBottomAction,
}: MainLayoutProps) {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-dvh bg-gray-100">
      <Sidebar
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        bottomAction={sidebarBottomAction}
      />
      <main className="min-h-dvh lg:ml-60 transition-[margin] duration-300">
        <TopNav pageTitle={pageTitle} onMenuClick={handleToggleSidebar} />
        <ContentContainer>{children}</ContentContainer>
      </main>
    </div>
  );
}
