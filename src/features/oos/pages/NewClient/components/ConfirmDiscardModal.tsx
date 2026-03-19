import type { Dispatch, SetStateAction } from "react";
import { Modal, Button } from "../../../../../components/common";
import { useNewClient } from "../context/NewClientContext";

interface ConfirmDiscardModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ConfirmDiscardModal({
  setModalOpen,
}: ConfirmDiscardModalProps) {
  const { discardDraft, isDiscarding, isEditMode } = useNewClient();

  const handleDiscard = async () => {
    await discardDraft();
  };

  return (
    <Modal
      setModalOpen={setModalOpen}
      title={isEditMode ? "Delete Client?" : "Discard Draft?"}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
            disabled={isDiscarding}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDiscard}
            isLoading={isDiscarding}
            className="!bg-status-rejected hover:!bg-red-700"
          >
            {isDiscarding ? "Deleting..." : isEditMode ? "Delete Client" : "Discard Draft"}
          </Button>
        </>
      }
    >
      <p className="mt-4 text-sm text-gray-600">
        {isEditMode
          ? "Are you sure you want to delete this client? This action cannot be undone."
          : "Are you sure you want to discard this draft? All entered information will be lost."}
      </p>
    </Modal>
  );
}
