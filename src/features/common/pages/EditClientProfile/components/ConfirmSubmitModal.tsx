import { useState, type Dispatch, type SetStateAction } from "react";
import { Modal, Button, CommentEditor, cleanupCommentImages } from "../../../../../components/common";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useEditClientProfile } from "../context/EditClientProfileContext";
import type { RichTextContent } from "../../../../../types/client-info";

const EMPTY_DOC: RichTextContent = { type: "doc", content: [] };

function hasContent(value: RichTextContent): boolean {
  if (!value.content || value.content.length === 0) return false;
  return value.content.some((node) => {
    if (node.type === "image") return true;
    return node.content && Array.isArray(node.content) && (node.content as unknown[]).length > 0;
  });
}

export default function ConfirmSubmitModal({
  setModalOpen,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { submitUpdate, isSubmitting } = useEditClientProfile();
  const [comment, setComment] = useState<RichTextContent>(EMPTY_DOC);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    cleanupCommentImages(comment);
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      await submitUpdate(hasContent(comment) ? comment : null);
    } catch (err) {
      setError(getErrorMessage(err, "Submission failed. Please try again."));
    }
  };

  return (
    <Modal
      title="Submit Profile Update?"
      setModalOpen={handleClose}
      maxWidth="max-w-2xl"
      actions={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Submit
          </Button>
        </>
      }
    >
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-600">
          This will submit the updated client profile for review by QTD / Manager.
        </p>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Comment <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <CommentEditor
            value={comment}
            onChange={setComment}
            placeholder="Add a note for the reviewer..."
            minHeight="60px"
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
