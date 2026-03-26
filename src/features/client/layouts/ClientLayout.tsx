import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, User, FileText, Receipt, FileSignature, ChevronUp, Eye } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import { FilePreviewOverlay } from "../../../components/common";
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
  const [letterFileIds, setLetterFileIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const res = await clientAPI.checkEngagementLetter();
        if (cancelled) return;
        setHasEngagementLetter(res.exists);
        if (res.exists) {
          const ids = await clientAPI.getEngagementLetterIds();
          if (!cancelled) setLetterFileIds(ids);
        }
      } catch {}
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const engagementLetterAction = hasEngagementLetter && letterFileIds.length > 0
    ? <EngagementLetterPopover fileIds={letterFileIds} />
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

function EngagementLetterPopover({ fileIds }: { fileIds: string[] }) {
  const [open, setOpen] = useState(false);
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
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
            {fileIds.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setPreviewFileId(id);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Eye className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {fileIds.length === 1 ? "Engagement Letter" : `Engagement Letter ${i + 1}`}
                </span>
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
      {previewFileId && (
        <FilePreviewOverlay
          fileId={previewFileId}
          fileName="Engagement Letter"
          setModalOpen={() => setPreviewFileId(null)}
        />
      )}
    </div>
  );
}
