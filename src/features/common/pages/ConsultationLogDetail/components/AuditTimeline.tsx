import { Send, Check, X, Plus } from "lucide-react";
import { consultationAPI } from "../../../../../api/consultation";
import { useAuth } from "../../../../../contexts/AuthContext";
import { formatDateTime } from "../../../../../lib/formatters";
import CommentPopover from "../../../../../components/common/CommentPopover";
import type { ConsultationLogAuditListItem } from "../../../../../types/consultation";

const auditConfig: Record<string, { label: string; icon: typeof Send; color: string; bg: string }> = {
  CREATED: { label: "Created", icon: Plus, color: "text-blue-600", bg: "bg-blue-100" },
  SUBMITTED: { label: "Submitted", icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
  APPROVED: { label: "Approved", icon: Check, color: "text-emerald-600", bg: "bg-emerald-100" },
  REJECTED: { label: "Rejected", icon: X, color: "text-red-500", bg: "bg-red-100" },
};

interface AuditTimelineProps {
  logId: string;
  audits: ConsultationLogAuditListItem[];
}

export default function AuditTimeline({ logId, audits }: AuditTimelineProps) {
  const { user } = useAuth();
  const currentUserName = user?.name ?? "";

  return (
    <div className="rounded-lg bg-white border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-bold text-primary">Activity</h3>
      </div>
      {audits.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-gray-400">No activity yet</p>
        </div>
      ) : (
        <div className="px-4 py-4 max-h-[calc(100dvh-120px)] overflow-y-auto">
          {audits.map((audit, i) => {
            const displayName = audit.performedByName === currentUserName ? "You" : audit.performedByName;
            const config = auditConfig[audit.action] ?? auditConfig.CREATED;
            const Icon = config.icon;
            const fetchComment = async () => {
              const res = await consultationAPI.getAuditComment(logId, audit.id);
              return res.comment;
            };

            return (
              <div key={audit.id} className="relative flex gap-3">
                {i < audits.length - 1 && (
                  <div className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-200" />
                )}
                <div className={`relative z-10 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                  <Icon className={`h-3 w-3 ${config.color}`} strokeWidth={2.5} />
                </div>
                <div className="pb-5 min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary leading-[26px]">
                    {config.label} &middot; {displayName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDateTime(audit.createdAt)}
                  </p>
                  {audit.hasComment && (
                    <CommentPopover fetchComment={fetchComment} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
