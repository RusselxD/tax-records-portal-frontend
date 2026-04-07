import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, User, FileText, Receipt, FileSignature, ChevronUp } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import { FilePreviewOverlay } from "../../../components/common";
import { engagementLetterAPI } from "../../../api/engagement-letter";
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
  const [letterFiles, setLetterFiles] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const res = await engagementLetterAPI.checkExists();
        if (cancelled || !res.exists) return;
        const files = await engagementLetterAPI.getMyLetters();
        if (!cancelled) setLetterFiles(files);
      } catch {}
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const engagementLetterAction = letterFiles.length > 0
    ? <EngagementLetterPopover files={letterFiles} />
    : null;

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

/* ── Popover that opens upward from sidebar bottom ── */

function EngagementLetterPopover({ files }: { files: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ id: string; name: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Popover panel — opens upward */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 overflow-hidden">
          <div className="py-1">
            {files.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => {
                  setPreviewFile(file);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        <FileSignature className="w-4 h-4" />
        <span className="flex-1 text-left">Engagement Letter</span>
        <ChevronUp className={`w-3.5 h-3.5 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {/* Preview overlay */}
      {previewFile && (
        <FilePreviewOverlay
          fileId={previewFile.id}
          fileName={previewFile.name}
          setModalOpen={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
