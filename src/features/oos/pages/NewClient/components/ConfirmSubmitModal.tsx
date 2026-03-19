import { useState, type Dispatch, type SetStateAction } from "react";
import { ConfirmActionModal } from "../../../../../components/common";
import { useNewClient } from "../context/NewClientContext";
import { useToast } from "../../../../../contexts/ToastContext";

interface ConfirmSubmitModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ConfirmSubmitModal({
  setModalOpen,
}: ConfirmSubmitModalProps) {
  const { submitForReview, header } = useNewClient();
  const { toastError } = useToast();
  const [comment, setComment] = useState("");

  const clientName = header?.clientDisplayName || "Unnamed Client";
  const hasClientName = !!header?.clientDisplayName?.trim();

  const handleConfirm = async () => {
    if (!hasClientName) {
      toastError("Required fields missing", "Client must have a name before submitting.");
      setModalOpen(false);
      return;
    }
    await submitForReview(comment.trim() || undefined);
  };

  return (
    <ConfirmActionModal
      setModalOpen={setModalOpen}
      onConfirm={handleConfirm}
      title="Submit Client for Review?"
      description={
        <p>
          This will send the client profile to QA for review. You won't be able to
          make changes until the review is complete.
        </p>
      }
      confirmLabel="Submit for Review"
      loadingLabel="Submitting..."
    >
      <div className="rounded-md bg-[#F0F3F7] px-3 py-2">
        <span className="text-xs text-gray-500">Client Name</span>
        <p className="text-sm font-medium text-primary">{clientName}</p>
      </div>

      <div>
        <label
          htmlFor="submit-comment"
          className="block text-xs text-gray-500 mb-1"
        >
          Message (optional)
        </label>
        <textarea
          id="submit-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a note for the reviewer..."
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-primary placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
        />
      </div>

    </ConfirmActionModal>
  );
}
