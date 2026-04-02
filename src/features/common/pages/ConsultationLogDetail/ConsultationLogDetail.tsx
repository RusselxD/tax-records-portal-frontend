import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle, Loader2,
  Trash2, Pencil,
  Clock, FileCheck, AlertCircle,
  type LucideIcon,
} from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { consultationAPI } from "../../../../api/consultation";
import { getErrorMessage, isNotFoundError } from "../../../../lib/api-error";
import { useToast } from "../../../../contexts/ToastContext";
import { useAuth } from "../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../constants/permissions";
import { getRolePrefix } from "../../../../constants/roles";
import NotFound from "../../../../pages/NotFound";
import { Button, ConfirmActionModal, CommentPreview } from "../../../../components/common";
import { FilePreviewOverlay } from "../../../../components/common";
import type { ConsultationLogDetail as DetailType, ConsultationLogAuditListItem } from "../../../../types/consultation";
import type { RichTextContent } from "../../../../types/client-info";
import { CONSULTATION_STATUS } from "../../../../types/consultation";
import EditConsultationLogForm from "./components/EditConsultationLogForm";
import AuditTimeline from "./components/AuditTimeline";
import LogDetailsCard from "./components/LogDetailsCard";
import ActionSection from "./components/ActionSection";
import BackButton from "../../../../components/common/BackButton";

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

const bannerConfig: Record<string, { icon: LucideIcon; message: string; className: string; showEdit?: boolean }> = {
  DRAFT: { icon: Pencil, message: "This log is a draft. Edit and submit when ready.", className: "bg-gray-50 border-gray-200 text-gray-600", showEdit: true },
  SUBMITTED: { icon: Clock, message: "Submitted for review. Waiting for approval.", className: "bg-blue-50 border-blue-200 text-blue-700" },
  APPROVED: { icon: FileCheck, message: "This consultation log has been approved.", className: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  REJECTED: { icon: AlertCircle, message: "This log was rejected. Review feedback and resubmit.", className: "bg-red-50 border-red-200 text-red-700", showEdit: true },
};

const actionConfig = {
  submit: { title: "Submit for Review?", description: "This will submit the log for QTD/Manager review.", label: "Submit", className: "" },
  approve: { title: "Approve?", description: "This will approve the consultation log.", label: "Approve", className: "!bg-emerald-500 hover:!bg-emerald-600" },
  reject: { title: "Reject?", description: "This will reject the log and send it back to the accountant.", label: "Reject", className: "!bg-red-500 hover:!bg-red-600" },
};

export default function ConsultationLogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const [log, setLog] = useState<DetailType | null>(null);
  const [audits, setAudits] = useState<ConsultationLogAuditListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ id: string; name: string } | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActionModal, setShowActionModal] = useState<"submit" | "approve" | "reject" | null>(null);
  const [actionComment, setActionComment] = useState<RichTextContent>(EMPTY_DOC);
  const [isEditing, setIsEditing] = useState(false);

  usePageTitle(log?.subject ?? "Consultation Log");

  const fetchLog = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [logData, auditData] = await Promise.all([
        consultationAPI.getLog(id),
        consultationAPI.getAudits(id),
      ]);
      setLog(logData);
      setAudits(auditData);
    } catch (err) {
      if (isNotFoundError(err)) setNotFound(true);
      else setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchLog(); }, [fetchLog]);

  if (notFound) return <NotFound inline />;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-6 w-6 text-gray-400 mb-3" />
        <p className="text-sm text-gray-500 mb-3">{error}</p>
        <Button variant="secondary" onClick={fetchLog}>Retry</Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <EditConsultationLogForm
        log={log}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => { setIsEditing(false); fetchLog(); }}
      />
    );
  }

  const canReview = hasPermission(user?.permissions, Permission.CONSULTATION_REVIEW);
  const isCreator = user?.id === log.createdById;
  const isDraft = log.status === CONSULTATION_STATUS.DRAFT;
  const isRejected = log.status === CONSULTATION_STATUS.REJECTED;
  const isSubmittedStatus = log.status === CONSULTATION_STATUS.SUBMITTED;
  const canEdit = isCreator && (isDraft || isRejected);
  const canDelete = isCreator && isDraft;
  const canSubmitLog = isCreator && (isDraft || isRejected);
  const canApproveReject = canReview && isSubmittedStatus;

  const hasCommentContent = (doc: RichTextContent) => {
    if (!doc.content || doc.content.length === 0) return false;
    return doc.content.some((n) => n.type === "image" || (n.content && Array.isArray(n.content) && (n.content as unknown[]).length > 0));
  };

  const handleAction = async () => {
    const comment = hasCommentContent(actionComment) ? actionComment : null;
    if (showActionModal === "submit") await consultationAPI.submitLog(log.id, comment);
    else if (showActionModal === "approve") await consultationAPI.approveLog(log.id, comment);
    else if (showActionModal === "reject") await consultationAPI.rejectLog(log.id, comment);

    const labels = { submit: "Submitted", approve: "Approved", reject: "Rejected" };
    toastSuccess(labels[showActionModal!], `Consultation log ${labels[showActionModal!].toLowerCase()}.`);
    setShowActionModal(null);
    setActionComment(EMPTY_DOC);
    fetchLog();
  };

  const bc = bannerConfig[log.status];
  const BIcon = bc.icon;

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between gap-4 mb-5">
        <BackButton label="Consultation Logs" onClick={() => navigate(`/${prefix}/consultation-logs`)} />

        <div className="flex items-center gap-3 shrink-0">
        {canDelete && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete"
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        </div>
      </div>

      {/* Status banner */}
      <div className={`flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm mb-4 ${bc.className}`}>
        <BIcon className="w-4 h-4 shrink-0" />
        <span className="flex-1">{bc.message}</span>
        {bc.showEdit && canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className={`inline-flex items-center gap-1.5 rounded-md bg-white border px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
              isRejected
                ? "border-red-200 text-red-700 hover:bg-red-100"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Pencil className="w-3 h-3" />
            {isRejected ? "Edit & Resubmit" : "Edit"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        <div className="space-y-4">
          <LogDetailsCard log={log} onPreviewFile={setPreviewFile} />

          {(canSubmitLog || canApproveReject) && (
            <ActionSection
              canSubmitLog={canSubmitLog}
              canApproveReject={canApproveReject}
              actionComment={actionComment}
              onCommentChange={setActionComment}
              onAction={setShowActionModal}
            />
          )}
        </div>

        <div className="space-y-4">
          <AuditTimeline logId={log.id} audits={audits} />
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmActionModal
          setModalOpen={setShowDeleteConfirm}
          onConfirm={() => consultationAPI.deleteLog(log.id)}
          title="Delete Consultation Log?"
          description="This will permanently delete this consultation log. This action cannot be undone."
          confirmLabel="Delete"
          loadingLabel="Deleting..."
          confirmClassName="bg-red-600 hover:bg-red-700"
          onSuccess={() => navigate(`/${prefix}/consultation-logs`)}
          onError={(err) => toastError(getErrorMessage(err, "Cannot delete this log."))}
        />
      )}

      {showActionModal && (
        <ConfirmActionModal
          setModalOpen={() => setShowActionModal(null)}
          onConfirm={handleAction}
          title={actionConfig[showActionModal].title}
          description={actionConfig[showActionModal].description}
          confirmLabel={actionConfig[showActionModal].label}
          loadingLabel={`${actionConfig[showActionModal].label}ing...`}
          confirmClassName={actionConfig[showActionModal].className}
          onSuccess={() => { setShowActionModal(null); setActionComment(EMPTY_DOC); }}
        >
          {hasCommentContent(actionComment) && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Comment</p>
              <div className="bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
                <CommentPreview content={actionComment} />
              </div>
            </div>
          )}
        </ConfirmActionModal>
      )}

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
