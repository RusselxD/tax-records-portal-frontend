import { useState, type Dispatch, type SetStateAction } from "react";
import { ConfirmActionModal, CommentEditor, cleanupCommentImages } from "../../../../../components/common";
import { useNewClient } from "../context/NewClientContext";
import { useToast } from "../../../../../contexts/ToastContext";
import type { RichTextContent } from "../../../../../types/client-info";

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

function hasContent(value: RichTextContent): boolean {
  if (!value.content || value.content.length === 0) return false;
  return value.content.some((node) => {
    if (node.type === "image") return true;
    return node.content && Array.isArray(node.content) && (node.content as unknown[]).length > 0;
  });
}

interface ConfirmSubmitModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ConfirmSubmitModal({
  setModalOpen,
}: ConfirmSubmitModalProps) {
  const { submitForReview, header } = useNewClient();
  const { toastError } = useToast();
  const [comment, setComment] = useState<RichTextContent>(EMPTY_DOC);

  const clientName = header?.displayName || "Unnamed Client";
  const hasClientName = !!header?.displayName?.trim();

  const handleClose: Dispatch<SetStateAction<boolean>> = (val) => {
    const open = typeof val === "function" ? val(true) : val;
    if (!open) cleanupCommentImages(comment);
    setModalOpen(val);
  };

  const handleConfirm = async () => {
    if (!hasClientName) {
      toastError("Required fields missing", "Client must have a name before submitting.");
      setModalOpen(false);
      return;
    }
    await submitForReview(hasContent(comment) ? comment : null);
  };

  return (
    <ConfirmActionModal
      setModalOpen={handleClose}
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
        <label className="block text-xs text-gray-500 mb-1">
          Message (optional)
        </label>
        <CommentEditor
          value={comment}
          onChange={setComment}
          placeholder="Add a note for the reviewer..."
          minHeight="60px"
        />
      </div>
    </ConfirmActionModal>
  );
}
