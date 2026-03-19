import { useState } from "react";
import { Button, Modal } from "../../../../../components/common";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useProfileUpdateReview } from "../context/ProfileUpdateReviewContext";

function ActionModal({
  title,
  description,
  submitLabel,
  requireComment,
  onSubmit,
  onClose,
}: {
  title: string;
  description: string;
  submitLabel: string;
  requireComment: boolean;
  onSubmit: (comment: string) => Promise<void>;
  onClose: () => void;
}) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = !requireComment || comment.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(comment);
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
      setModalOpen={() => onClose()}
      actions={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!canSubmit}>
            {submitLabel}
          </Button>
        </>
      }
    >
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-600">{description}</p>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Comment {!requireComment && <span className="font-normal text-gray-400">(optional)</span>}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={requireComment ? "Provide a reason..." : "Add a note..."}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-primary placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          />
        </div>
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
  const [modal, setModal] = useState<"approve" | "reject" | null>(null);

  return (
    <>
      <div className="rounded-lg bg-white border border-gray-200 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <p className="text-sm text-gray-500 mb-4">
          Review the changes above and approve or reject this profile update.
        </p>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setModal("reject")}>
            Reject
          </Button>
          <Button onClick={() => setModal("approve")}>
            Approve
          </Button>
        </div>
      </div>

      {modal === "approve" && (
        <ActionModal
          title="Approve Profile Update?"
          description="This will apply the proposed changes to the client's profile."
          submitLabel="Approve"
          requireComment={false}
          onSubmit={approveUpdate}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "reject" && (
        <ActionModal
          title="Reject Profile Update?"
          description="The submitter will be notified and can revise the changes."
          submitLabel="Reject"
          requireComment={false}
          onSubmit={rejectUpdate}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
