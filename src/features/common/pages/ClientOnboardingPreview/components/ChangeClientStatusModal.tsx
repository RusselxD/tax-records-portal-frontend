import { useState, type Dispatch, type SetStateAction } from "react";
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

  const availableOptions = STATUS_OPTIONS.filter(
    (o) => o.value !== currentStatus,
  );

  async function handleSubmit() {
    if (!selected) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await clientAPI.updateClientStatus(clientId, selected as ClientStatus);
      onSuccess(selected as ClientStatus);
      setModalOpen(false);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to update client status. Try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title="Change Client Status"
      setModalOpen={setModalOpen}
      maxWidth="max-w-md"
      actions={
        <>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selected} isLoading={isSubmitting}>
            Confirm
          </Button>
        </>
      }
    >
      <div className="space-y-2 mt-2">
        <p className="text-sm text-gray-500">
          Select a new status for this client.
        </p>

        <div className="space-y-1.5">
          <label className="field-label">New Status</label>
          <Dropdown
            options={availableOptions}
            value={selected}
            onChange={(val) => setSelected(val as ClientStatus)}
            placeholder="Select status..."
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}
