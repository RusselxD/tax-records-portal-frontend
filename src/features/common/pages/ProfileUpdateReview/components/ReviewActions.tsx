import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button, Modal, CommentEditor, CommentPreview } from "../../../../../components/common";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useProfileUpdateReview } from "../context/ProfileUpdateReviewContext";
import type { RichTextContent } from "../../../../../types/client-info";

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

function hasContent(value: RichTextContent): boolean {
  if (!value.content || value.content.length === 0) return false;
  return value.content.some((node) => {
    if (node.type === "image") return true;
    return node.content && Array.isArray(node.content) && (node.content as unknown[]).length > 0;
  });
}

function ConfirmModal({
  title,
  description,
  submitLabel,
  submitClass,
  comment,
  onSubmit,
  onClose,
}: {
  title: string;
  description: string;
  submitLabel: string;
  submitClass?: string;
  comment: RichTextContent | null;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Action failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={title}
      setModalOpen={onClose}
      maxWidth="max-w-2xl"
      actions={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} className={submitClass}>
            {submitLabel}
          </Button>
        </>
      }
    >
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-600">{description}</p>

        {comment && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Comment</p>
            <div className="bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
              <CommentPreview content={comment} className="text-xs" />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-700 bg-red-50 rounded-md px-3 py-2 border border-red-200">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

export default function ReviewActions() {
  const { approveUpdate, rejectUpdate } = useProfileUpdateReview();
  const [comment, setComment] = useState<RichTextContent>(EMPTY_DOC);
  const [modal, setModal] = useState<"approve" | "reject" | null>(null);

  const commentToSend = hasContent(comment) ? comment : null;

  return (
    <>
      <div className="rounded-lg bg-white border border-gray-200 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Review Comments / Rejection Reason <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <CommentEditor
            value={comment}
            onChange={setComment}
            placeholder="Enter details regarding approval or specific reasons for rejection..."
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModal("reject")}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium border-2 border-red-400 text-red-500 bg-white hover:bg-red-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
          <button
            onClick={() => setModal("approve")}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            <Check className="h-4 w-4" />
            Approve
          </button>
        </div>
      </div>

      {modal === "approve" && (
        <ConfirmModal
          title="Approve Profile Update?"
          description="This will apply the proposed changes to the client's profile."
          submitLabel="Approve"
          submitClass="!bg-emerald-500 hover:!bg-emerald-600"
          comment={commentToSend}
          onSubmit={() => approveUpdate(commentToSend)}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "reject" && (
        <ConfirmModal
          title="Reject Profile Update?"
          description="The submitter will be notified and can revise the changes."
          submitLabel="Reject"
          submitClass="!bg-red-500 hover:!bg-red-600"
          comment={commentToSend}
          onSubmit={() => rejectUpdate(commentToSend)}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
