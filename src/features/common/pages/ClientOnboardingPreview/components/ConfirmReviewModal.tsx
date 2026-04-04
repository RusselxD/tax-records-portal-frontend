import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { getErrorMessage, isConflictError } from "../../../../../lib/api-error";
import { Modal, Button, CommentPreview } from "../../../../../components/common";
import { clientAPI } from "../../../../../api/client";
import { useToast } from "../../../../../contexts/ToastContext";
import { useInfoReview } from "../context/ClientOnboardingPreviewContext";
import type { ProfileReviewStatus } from "../../../../../types/client-profile";
import type { RichTextContent } from "../../../../../types/client-info";

type ReviewAction = "approve" | "reject";

const CONFIG: Record<
  ReviewAction,
  {
    title: string;
    verb: string;
    verbIng: string;
    toastTitle: string;
    toastMessage: string;
    status: ProfileReviewStatus;
    buttonClass: string;
    apiFn: (taskId: string, remarks: RichTextContent | null) => Promise<unknown>;
  }
> = {
  approve: {
    title: "Approve Profile?",
    verb: "Approve Profile",
    verbIng: "Approving...",
    toastTitle: "Profile Approved",
    toastMessage: "The client profile has been approved.",
    status: "APPROVED",
    buttonClass: "!bg-emerald-500 hover:!bg-emerald-600",
    apiFn: clientAPI.approveClientInfo,
  },
  reject: {
    title: "Reject Profile?",
    verb: "Reject Profile",
    verbIng: "Rejecting...",
    toastTitle: "Profile Rejected",
    toastMessage: "The client profile has been rejected.",
    status: "REJECTED",
    buttonClass: "!bg-status-rejected hover:!bg-red-700",
    apiFn: clientAPI.rejectClientInfo,
  },
};

function hasContent(value: RichTextContent): boolean {
  if (!value.content || value.content.length === 0) return false;
  return value.content.some((node) => {
    if (node.type === "image") return true;
    return node.content && Array.isArray(node.content) && (node.content as unknown[]).length > 0;
  });
}

interface ConfirmReviewModalProps {
  action: ReviewAction;
  setModalOpen: (() => void) | Dispatch<SetStateAction<boolean>>;
  clientName: string;
  remarks: RichTextContent;
  onSuccess: () => void;
}

export default function ConfirmReviewModal({
  action,
  setModalOpen,
  clientName,
  remarks,
  onSuccess,
}: ConfirmReviewModalProps) {
  const { taskId, setHasActiveTask, setLastReviewStatus, signalLogsRefetch, refetch } = useInfoReview();
  const { toastSuccess } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cfg = CONFIG[action];
  const remarksToSend = hasContent(remarks) ? remarks : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isSubmitting && !(e.target instanceof HTMLElement && (e.target.closest("[contenteditable]") || e.target.tagName === "TEXTAREA"))) handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await cfg.apiFn(taskId, remarksToSend);
      toastSuccess(cfg.toastTitle, cfg.toastMessage);
      setHasActiveTask(false);
      setLastReviewStatus(cfg.status);
      signalLogsRefetch();
      setModalOpen(false);
      onSuccess();
    } catch (err) {
      if (isConflictError(err)) {
        setModalOpen(false);
        refetch();
      }
      setError(getErrorMessage(err, "Something went wrong. Try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      setModalOpen={setModalOpen}
      title={cfg.title}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className={cfg.buttonClass}
          >
            {isSubmitting ? cfg.verbIng : cfg.verb}
          </Button>
        </>
      }
    >
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-600">
          Are you sure you want to {action} the profile for{" "}
          <span className="font-semibold text-primary">{clientName}</span>?
        </p>

        {remarksToSend && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Remarks</p>
            <div className="bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
              <CommentPreview content={remarksToSend} />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-status-rejected">{error}</p>
        )}
      </div>
    </Modal>
  );
}
