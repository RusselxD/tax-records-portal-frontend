import { useEffect, useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { Button, Modal, CommentPreview } from "../../../../../components/common";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useToast } from "../../../../../contexts/ToastContext";
import { useTaxRecordTaskDetails } from "../context/TaxRecordTaskDetailsContext";
import type { RichTextContent } from "../../../../../types/client-info";
import type { ModalType } from "./task-action-types";

interface TaskActionModalsProps {
  activeModal: ModalType;
  comment: RichTextContent;
  onClose: () => void;
  onSuccess: () => void;
}

const modalConfig: Record<
  Exclude<ModalType, null>,
  { title: string; description: string; note?: string; confirmLabel: string; confirmClass?: string; successMessage: string }
> = {
  submit: {
    title: "Submit for Review?",
    description: "Are you sure you want to submit this task for review?",
    confirmLabel: "Submit",
    successMessage: "Task submitted for review",
  },
  approve: {
    title: "Approve Task?",
    description: "Are you sure you want to approve this task for filing?",
    confirmLabel: "Approve",
    confirmClass: "!bg-emerald-500 hover:!bg-emerald-600",
    successMessage: "Task approved for filing",
  },
  reject: {
    title: "Reject Task?",
    description: "Are you sure you want to reject this task?",
    confirmLabel: "Reject",
    confirmClass: "!bg-red-500 hover:!bg-red-600",
    successMessage: "Task rejected",
  },
  "mark-filed": {
    title: "Mark as Filed?",
    description: "Are you sure you want to mark this task as filed?",
    confirmLabel: "Mark as Filed",
    successMessage: "Task marked as filed",
  },
  "mark-completed": {
    title: "Mark as Completed?",
    description: "Are you sure you want to mark this task as completed?",
    note: "Once completed, the finalized records will be visible to the client on their portal.",
    confirmLabel: "Mark as Completed",
    successMessage: "Task marked as completed",
  },
};

function hasCommentContent(comment: RichTextContent): boolean {
  if (!comment.content || comment.content.length === 0) return false;
  return comment.content.some((node) => {
    if (node.type === "image") return true;
    return node.content && Array.isArray(node.content) && (node.content as unknown[]).length > 0;
  });
}

export default function TaskActionModals({
  activeModal,
  comment,
  onClose,
  onSuccess,
}: TaskActionModalsProps) {
  const { submitTask, approveTask, rejectTask, markFiled, markCompleted } =
    useTaxRecordTaskDetails();
  const { toastSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commentToSend = hasCommentContent(comment) ? comment : null;

  const handleConfirm = useCallback(async () => {
    if (!activeModal) return;
    setIsLoading(true);
    setError(null);
    try {
      switch (activeModal) {
        case "submit":
          await submitTask(commentToSend);
          break;
        case "approve":
          await approveTask(commentToSend);
          break;
        case "reject":
          await rejectTask(commentToSend);
          break;
        case "mark-filed":
          await markFiled();
          break;
        case "mark-completed":
          await markCompleted();
          break;
      }
      toastSuccess(modalConfig[activeModal].successMessage);
      onSuccess();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [activeModal, commentToSend, submitTask, approveTask, rejectTask, markFiled, markCompleted, toastSuccess, onSuccess, onClose]);

  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading) {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, isLoading, handleConfirm]);

  if (!activeModal) return null;

  const config = modalConfig[activeModal];

  const setModalOpen: Dispatch<SetStateAction<boolean>> = (val) => {
    const open = typeof val === "function" ? val(true) : val;
    if (!open) onClose();
  };

  return (
    <Modal
      title={config.title}
      setModalOpen={setModalOpen}
      actions={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            className={config.confirmClass}
          >
            {config.confirmLabel}
          </Button>
        </>
      }
    >
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-600">{config.description}</p>

        {config.note && (
          <p className="text-sm text-amber-600 bg-amber-50 rounded-md px-3 py-2 border border-amber-200">
            {config.note}
          </p>
        )}

        {commentToSend && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Comment</p>
            <div className="bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
              <CommentPreview content={commentToSend} />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-700 bg-red-50 rounded-md px-3 py-2 border border-red-200">{error}</p>
        )}
      </div>
    </Modal>
  );
}
