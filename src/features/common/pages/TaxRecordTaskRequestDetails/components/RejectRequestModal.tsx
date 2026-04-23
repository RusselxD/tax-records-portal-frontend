import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import { Button } from "../../../../../components/common";
import { taxRecordTaskRequestAPI } from "../../../../../api/tax-record-task-request";
import { useToast } from "../../../../../contexts/ToastContext";
import { getErrorMessage } from "../../../../../lib/api-error";

const MAX_REASON = 1000;

interface RejectRequestModalProps {
  requestId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}

export default function RejectRequestModal({
  requestId,
  setModalOpen,
  onSuccess,
}: RejectRequestModalProps) {
  const { toastSuccess, toastError } = useToast();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const trimmed = reason.trim();
      await taxRecordTaskRequestAPI.reject(requestId, {
        reason: trimmed || undefined,
      });
      toastSuccess("Request Rejected", "The requester has been notified.");
      setModalOpen(false);
      onSuccess();
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to reject request."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalContainer setModalOpen={setModalOpen}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-primary">Reject Task Request</h2>
          <button
            onClick={() => setModalOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            Optionally explain why this request is being rejected. The requester
            will see this reason and will need to file a new request.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, MAX_REASON))}
              rows={4}
              placeholder="e.g. Wrong sub-category — please use Annual VAT instead."
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-primary placeholder-gray-400 resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {reason.length} / {MAX_REASON}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            isLoading={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            Reject Request
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
}
