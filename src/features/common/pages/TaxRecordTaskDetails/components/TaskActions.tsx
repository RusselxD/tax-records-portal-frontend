import { useState } from "react";
import { Send, Check, X, Flag, CheckCircle, Undo2, Loader2 } from "lucide-react";
import { useTaxRecordTaskDetails } from "../context/TaxRecordTaskDetailsContext";
import { getErrorMessage } from "../../../../../lib/api-error";
import { CommentEditor } from "../../../../../components/common";
import type { RichTextContent } from "../../../../../types/client-info";
import TaskActionModals from "./TaskActionModals";
import type { ModalType } from "./task-action-types";

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

export default function TaskActions() {
  const { canSubmit, canReview, canMarkFiled, canMarkCompleted, canRecall, recallTask } =
    useTaxRecordTaskDetails();
  const [comment, setComment] = useState<RichTextContent>(EMPTY_DOC);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isRecalling, setIsRecalling] = useState(false);
  const [recallError, setRecallError] = useState<string | null>(null);

  const hasActions = canSubmit || canReview || canMarkFiled || canMarkCompleted || canRecall;
  if (!hasActions) return null;

  const handleRecall = async () => {
    setIsRecalling(true);
    setRecallError(null);
    try {
      await recallTask();
    } catch (err) {
      setRecallError(getErrorMessage(err));
    } finally {
      setIsRecalling(false);
    }
  };

  const showComment = canSubmit || canReview;

  return (
    <div className="rounded-lg bg-white border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-bold text-primary">
          {canReview ? "Review Comments / Rejection Reason" : "Actions"}
        </h2>
      </div>
      <div className="px-6 py-5">
        {showComment && (
          <div className="mb-5 max-w-2xl">
            <CommentEditor
              value={comment}
              onChange={setComment}
              placeholder={
                canReview
                  ? "Enter details regarding approval or specific reasons for rejection..."
                  : "Add a comment (optional)..."
              }
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          {canSubmit && (
            <button
              onClick={() => setActiveModal("submit")}
              className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              <Send className="h-4 w-4" />
              Submit for Review
            </button>
          )}
          {canReview && (
            <>
              <button
                onClick={() => setActiveModal("reject")}
                className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium border-2 border-red-400 text-red-500 bg-white hover:bg-red-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={() => setActiveModal("approve")}
                className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <Check className="h-4 w-4" />
                Approve
              </button>
            </>
          )}
          {canMarkFiled && (
            <button
              onClick={() => setActiveModal("mark-filed")}
              className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              <Flag className="h-4 w-4" />
              Mark as Filed
            </button>
          )}
          {canMarkCompleted && (
            <button
              onClick={() => setActiveModal("mark-completed")}
              className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Mark as Completed
            </button>
          )}
          {canRecall && (
            <button
              onClick={handleRecall}
              disabled={isRecalling}
              className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isRecalling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Undo2 className="h-4 w-4" />
              )}
              Recall Submission
            </button>
          )}
        </div>
        {recallError && (
          <p className="mt-3 text-sm text-status-rejected">{recallError}</p>
        )}
      </div>

      <TaskActionModals
        activeModal={activeModal}
        comment={comment}
        onClose={() => setActiveModal(null)}
        onSuccess={() => setComment(EMPTY_DOC)}
      />
    </div>
  );
}
