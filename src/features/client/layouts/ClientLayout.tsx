import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, User, FileText, Receipt, Download, Loader2 } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import { clientAPI } from "../../../api/client";
import type { NavItem } from "../../../types/navigation";

const clientNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/client/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "profile",
    label: "Profile",
    path: "/client/profile",
    icon: User,
  },
  {
    id: "tax-records",
    label: "Tax Records",
    path: "/client/tax-records",
    icon: FileText,
  },
  {
    id: "invoice",
    label: "Invoice",
    path: "/client/invoice",
    icon: Receipt,
  },
];

const pageTitles: Record<string, string> = {
  "/client/dashboard": "Dashboard",
  "/client/profile": "Profile",
  "/client/tax-records": "Tax Records",
  "/client/invoice": "Invoice",
};

export default function ClientLayout() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "";
  const [hasEngagementLetter, setHasEngagementLetter] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    clientAPI.checkEngagementLetter().then((res) => {
      setHasEngagementLetter(res.exists);
    }).catch(() => {});
  }, []);

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await clientAPI.downloadEngagementLetter();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Engagement Letter.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent — file may have been removed since the exists check
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

  const engagementLetterAction = hasEngagementLetter ? (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
    >
      {downloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>Engagement Letter</span>
    </button>
  ) : null;

  return (
    <MainLayout
      navItems={clientNavItems}
      pageTitle={pageTitle}
      sidebarBottomAction={engagementLetterAction}
    >
      <Outlet />
    </MainLayout>
  );
}
