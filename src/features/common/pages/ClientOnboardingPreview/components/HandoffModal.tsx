import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Modal, Button, Dropdown, MultiSelect, Alert } from "../../../../../components/common";
import { clientAPI } from "../../../../../api/client";
import { usersAPI } from "../../../../../api/users";
import { getErrorMessage, isConflictError } from "../../../../../lib/api-error";
import type { AccountantListItemResponse } from "../../../../../types/user";

interface HandoffModalProps {
  clientId: string;
  creatorId: string | null;
  currentQtdId: string | null;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
  onConflict: () => void;
}

const ACK_ITEMS = [
  { key: "onboardingComplete", label: "All onboarding steps completed" },
  { key: "permanentFilesTracked", label: "Permanent files requested and tracked" },
  { key: "drivesAndTemplates", label: "Drives and templates setup completed" },
  { key: "collaborationSetup", label: "Collaboration setup established" },
  { key: "readyForMre", label: "Client ready for full MRE servicing" },
] as const;

type AckKey = (typeof ACK_ITEMS)[number]["key"];
type AckState = Record<AckKey, boolean>;

const INITIAL_ACKS: AckState = {
  onboardingComplete: false,
  permanentFilesTracked: false,
  drivesAndTemplates: false,
  collaborationSetup: false,
  readyForMre: false,
};

export default function HandoffModal({
  clientId,
  creatorId,
  currentQtdId,
  setModalOpen,
  onSuccess,
  onConflict,
}: HandoffModalProps) {
  const [csdOosIds, setCsdOosIds] = useState<string[]>([]);
  const [qtdId, setQtdId] = useState(currentQtdId ?? "");
  const [acks, setAcks] = useState<AckState>(INITIAL_ACKS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [csdOosAccountants, setCsdOosAccountants] = useState<AccountantListItemResponse[]>([]);
  const [qtdAccountants, setQtdAccountants] = useState<AccountantListItemResponse[]>([]);

  useEffect(() => {
    let cancelled = false;
    const fetchAccountants = async () => {
      try {
        const [csdOos, qtd] = await Promise.all([
          usersAPI.getAccountants("CSD,OOS"),
          usersAPI.getAccountants("QTD"),
        ]);
        if (cancelled) return;
        setCsdOosAccountants(csdOos);
        setQtdAccountants(qtd);
      } catch {
        if (!cancelled) {
          setSubmitError("Failed to load accountants. Close and try again.");
        }
      }
    };
    fetchAccountants();
    return () => { cancelled = true; };
  }, []);

  const csdOosOptions = csdOosAccountants
    .filter((a) => a.id !== creatorId)
    .map((a) => ({ value: a.id, label: a.displayName }));

  const qtdOptions = qtdAccountants.map((a) => ({
    value: a.id,
    label: a.displayName,
  }));

  const allAcked = ACK_ITEMS.every((item) => acks[item.key]);
  const canSubmit = csdOosIds.length > 0 && !!qtdId && allAcked && !isSubmitting;

  const toggleAck = (key: AckKey) => {
    setAcks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await clientAPI.handoffClient(clientId, {
        csdOosAccountantIds: csdOosIds,
        qtdAccountantId: qtdId,
      });
      onSuccess();
      setModalOpen(false);
    } catch (err) {
      if (isConflictError(err)) onConflict();
      setSubmitError(getErrorMessage(err, "Failed to hand off client. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Hand Off Client"
      setModalOpen={setModalOpen}
      maxWidth="max-w-lg"
      actions={
        <>
          <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!canSubmit}>
            Hand Off Client
          </Button>
        </>
      }
    >
      <div className="space-y-4 mt-2">
        <p className="text-sm text-gray-600">
          Pick the accountants who will take over this client. You will be removed
          from the assignment as part of the handoff and will no longer be able to
          edit this client unless you are one of the chosen accountants.
        </p>

        {submitError && (
          <Alert variant="error">{submitError}</Alert>
        )}

        <MultiSelect
          portal
          label="OOS / CSD Accountants"
          options={csdOosOptions}
          value={csdOosIds}
          onChange={setCsdOosIds}
          placeholder="Select at least one accountant"
        />

        <Dropdown
          portal
          label="QTD Accountant"
          options={qtdOptions}
          value={qtdId}
          onChange={setQtdId}
          placeholder="Select an accountant"
        />

        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Handoff Checklist
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Confirm each item before handing off this client.
          </p>
          <ul className="space-y-2">
            {ACK_ITEMS.map((item) => (
              <li key={item.key}>
                <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-accent cursor-pointer"
                    checked={acks[item.key]}
                    onChange={() => toggleAck(item.key)}
                    disabled={isSubmitting}
                  />
                  <span className="leading-relaxed">{item.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-500 italic">
          This will create an archive snapshot of the current profile, assign the
          chosen accountants, and transition the client. This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
