import { useState, type Dispatch, type SetStateAction } from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { Modal, Button } from "../../../../../components/common";
import { clientAPI } from "../../../../../api/client";
import { useToast } from "../../../../../contexts/ToastContext";
import { useInfoReview } from "../context/ClientOnboardingPreviewContext";

interface ConfirmRejectModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  clientName: string;
  remarks: string;
  onSuccess: () => void;
}

export default function ConfirmRejectModal({
  setModalOpen,
  clientName,
  remarks,
  onSuccess,
}: ConfirmRejectModalProps) {
  const { taskId, setHasActiveTask, setLastReviewStatus, signalLogsRefetch } = useInfoReview();
  const { toastSuccess } = useToast();
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReject = async () => {
    setIsRejecting(true);
    setError(null);
    try {
      await clientAPI.rejectClientInfo(taskId, remarks);
      toastSuccess("Profile Rejected", "The client profile has been rejected.");
      setHasActiveTask(false);
      setLastReviewStatus("REJECTED");
      signalLogsRefetch();
      setModalOpen(false);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong. Try again."));
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Modal
      setModalOpen={setModalOpen}
      title="Reject Profile?"
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
            disabled={isRejecting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            isLoading={isRejecting}
            className="!bg-status-rejected hover:!bg-red-700"
          >
            {isRejecting ? "Rejecting..." : "Reject Profile"}
          </Button>
        </>
      }
    >
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-600">
          Are you sure you want to reject the profile for{" "}
          <span className="font-semibold text-primary">{clientName}</span>?
        </p>

        {remarks && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Remarks</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
              {remarks}
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-status-rejected">{error}</p>
        )}
      </div>
    </Modal>
  );
}
