import { useState, type Dispatch, type SetStateAction } from "react";
import { Loader2 } from "lucide-react";
import { clientAPI } from "../../../../../api/client";
import { CLIENT_STATUS, type ClientStatus } from "../../../../../types/client";
import { getErrorMessage } from "../../../../../lib/api-error";
import Modal from "../../../../../components/common/Modal";
import Dropdown from "../../../../../components/common/Dropdown";
import Button from "../../../../../components/common/Button";

const STATUS_OPTIONS = [
  { label: "Onboarding", value: CLIENT_STATUS.ONBOARDING },
  { label: "Active Client", value: CLIENT_STATUS.ACTIVE_CLIENT },
  { label: "Offboarding", value: CLIENT_STATUS.OFFBOARDING },
  { label: "Inactive Client", value: CLIENT_STATUS.INACTIVE_CLIENT },
];

interface ChangeClientStatusModalProps {
  clientId: string;
  currentStatus: ClientStatus;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: (newStatus: ClientStatus) => void;
}

export default function ChangeClientStatusModal({
  clientId,
  currentStatus,
  setModalOpen,
  onSuccess,
}: ChangeClientStatusModalProps) {
  const [selected, setSelected] = useState<ClientStatus | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableOptions = STATUS_OPTIONS.filter((o) => o.value !== currentStatus);

  async function handleSubmit() {
    if (!selected) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await clientAPI.updateClientStatus(clientId, selected as ClientStatus);
      onSuccess(selected as ClientStatus);
      setModalOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update client status. Try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title="Change Client Status" setModalOpen={setModalOpen} maxWidth="max-w-md">
      <div className="space-y-5">
        <p className="text-sm text-gray-500">
          Select a new status for this client. Only the Manager can perform this action.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            New Status
          </label>
          <Dropdown
            options={availableOptions}
            value={selected}
            onChange={(val) => setSelected(val as ClientStatus)}
            placeholder="Select status..."
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selected}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
