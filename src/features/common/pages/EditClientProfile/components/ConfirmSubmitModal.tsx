import { useState, type Dispatch, type SetStateAction } from "react";
import { Modal, Button } from "../../../../../components/common";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useEditClientProfile } from "../context/EditClientProfileContext";

export default function ConfirmSubmitModal({
  setModalOpen,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { submitUpdate, isSubmitting } = useEditClientProfile();
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      await submitUpdate(comment || undefined);
    } catch (err) {
      setError(getErrorMessage(err, "Submission failed. Please try again."));
    }
  };

  return (
    <Modal
      title="Submit Profile Update?"
      setModalOpen={setModalOpen}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
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
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Add a note for the reviewer..."
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
