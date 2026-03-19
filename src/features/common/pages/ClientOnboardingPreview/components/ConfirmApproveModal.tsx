import { useState, type Dispatch, type SetStateAction } from "react";
import { getErrorMessage } from "../../../../../lib/api-error";
import { Modal, Button } from "../../../../../components/common";
import { clientAPI } from "../../../../../api/client";
import { useToast } from "../../../../../contexts/ToastContext";
import { useInfoReview } from "../context/ClientOnboardingPreviewContext";

interface ConfirmApproveModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  clientName: string;
  remarks: string;
  onSuccess: () => void;
}

export default function ConfirmApproveModal({
  setModalOpen,
  clientName,
  remarks,
  onSuccess,
}: ConfirmApproveModalProps) {
  const { taskId, setHasActiveTask, setLastReviewStatus, signalLogsRefetch } = useInfoReview();
  const { toastSuccess } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);
    try {
      await clientAPI.approveClientInfo(taskId, remarks);
      toastSuccess("Profile Approved", "The client profile has been approved.");
      setHasActiveTask(false);
      setLastReviewStatus("APPROVED");
      signalLogsRefetch();
      setModalOpen(false);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong. Try again."));
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Modal
      setModalOpen={setModalOpen}
      title="Approve Profile?"
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            isLoading={isApproving}
            className="!bg-emerald-500 hover:!bg-emerald-600"
          >
            {isApproving ? "Approving..." : "Approve Profile"}
          </Button>
        </>
      }
    >
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-600">
          Are you sure you want to approve the profile for{" "}
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
