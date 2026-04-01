import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { clientAPI } from "../../../../../api/client";
import { usersAPI } from "../../../../../api/users";
import { CLIENT_STATUS, type ClientStatus } from "../../../../../types/client";
import type { AccountantListItemResponse } from "../../../../../types/user";
import { Info } from "lucide-react";
import { getErrorMessage } from "../../../../../lib/api-error";
import Modal from "../../../../../components/common/Modal";
import Dropdown from "../../../../../components/common/Dropdown";
import Input from "../../../../../components/common/Input";
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

  // Offboarding fields
  const [oosAccountantId, setOosAccountantId] = useState("");
  const [endOfEngagementDate, setEndOfEngagementDate] = useState("");
  const [deactivationDate, setDeactivationDate] = useState("");
  const [oosAccountants, setOosAccountants] = useState<AccountantListItemResponse[]>([]);

  const isOffboarding = selected === CLIENT_STATUS.OFFBOARDING;

  // Fetch OOS accountants when offboarding is selected
  useEffect(() => {
    if (!isOffboarding) return;
    usersAPI.getAccountants("OOS").then(setOosAccountants).catch(() => { console.warn("Failed to load OOS accountants"); });
  }, [isOffboarding]);

  const availableOptions = STATUS_OPTIONS.filter(
    (o) => o.value !== currentStatus,
  );

  const oosOptions = oosAccountants.map((a) => ({
    value: a.id,
    label: a.displayName,
  }));

  const canSubmit = isOffboarding
    ? !!(oosAccountantId && endOfEngagementDate)
    : !!selected;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (isOffboarding) {
        await clientAPI.offboardClient(clientId, {
          oosAccountantId,
          endOfEngagementDate,
          deactivationDate: deactivationDate || null,
        });
      } else {
        await clientAPI.updateClientStatus(clientId, selected as ClientStatus);
      }
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
      maxWidth={isOffboarding ? "max-w-lg" : "max-w-md"}
      actions={
        <>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit} isLoading={isSubmitting}>
            Confirm
          </Button>
        </>
      }
    >
      <div className="space-y-4 mt-2">
        <p className="text-sm text-gray-500">
          Select a new status for this client.
        </p>

        <div>
          <label className="field-label">New Status</label>
          <Dropdown
            portal
            options={availableOptions}
            value={selected}
            onChange={(val) => {
              setSelected(val as ClientStatus);
              setError(null);
            }}
            placeholder="Select status..."
          />
        </div>

        {isOffboarding && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              Offboarding Details
            </p>

            <Dropdown
              portal
              label="Assigned OOS Accountant"
              options={oosOptions}
              value={oosAccountantId}
              onChange={setOosAccountantId}
              placeholder="Select OOS accountant..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="End of Engagement Date"
                type="date"
                value={endOfEngagementDate}
                onChange={(e) => setEndOfEngagementDate(e.target.value)}
              />
              <div>
                <Input
                  label="Deactivation Date"
                  type="date"
                  value={deactivationDate}
                  onChange={(e) => setDeactivationDate(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">Optional</p>
              </div>
            </div>

            {deactivationDate && (
              <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5">
                <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  On this date, all portal accounts associated with this client will be automatically deactivated and the client status will be set to Inactive.
                </p>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}
