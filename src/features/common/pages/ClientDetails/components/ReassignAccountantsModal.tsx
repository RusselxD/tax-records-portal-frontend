import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Modal, Button, Dropdown, MultiSelect } from "../../../../../components/common";
import { clientAPI } from "../../../../../api/client";
import { usersAPI } from "../../../../../api/users";
import { useToast } from "../../../../../contexts/ToastContext";
import { getErrorMessage } from "../../../../../lib/api-error";
import type { AssignedAccountant } from "../../../../../types/client-info";
import type { AccountantListItemResponse } from "../../../../../types/user";

interface ReassignAccountantsModalProps {
  clientId: string;
  currentCsdOos: AssignedAccountant[];
  currentQtd: AssignedAccountant[];
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}

export default function ReassignAccountantsModal({
  clientId,
  currentCsdOos,
  currentQtd,
  setModalOpen,
  onSuccess,
}: ReassignAccountantsModalProps) {
  const { toastSuccess, toastError } = useToast();

  const [csdOosIds, setCsdOosIds] = useState<string[]>(currentCsdOos.map((a) => a.id));
  const [qtdId, setQtdId] = useState(currentQtd[0]?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.warn("Failed to load accountants for reassignment");
      }
    };
    fetchAccountants();
    return () => { cancelled = true; };
  }, []);

  const csdOosOptions = csdOosAccountants.map((a) => ({
    value: a.id,
    label: a.displayName,
  }));

  const qtdOptions = qtdAccountants.map((a) => ({
    value: a.id,
    label: a.displayName,
  }));

  const canSubmit = csdOosIds.length > 0 && !!qtdId;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await clientAPI.reassignAccountants(clientId, {
        csdOosAccountantIds: csdOosIds,
        qtdAccountantId: qtdId,
      });
      toastSuccess("Accountants Reassigned", "The assigned accountants have been updated.");
      onSuccess();
      setModalOpen(false);
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to reassign accountants."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Reassign Accountants"
      setModalOpen={setModalOpen}
      maxWidth="max-w-lg"
      actions={
        <>
          <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!canSubmit}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4 mt-2">
        <p className="text-sm text-gray-500">
          Update the accountants assigned to this client.
        </p>

        <MultiSelect
          portal
          label="OOS / CSD Accountants"
          options={csdOosOptions}
          value={csdOosIds}
          onChange={setCsdOosIds}
          placeholder="Select accountants"
        />

        <Dropdown
          portal
          label="QTD Accountant"
          options={qtdOptions}
          value={qtdId}
          onChange={setQtdId}
          placeholder="Select accountant"
        />
      </div>
    </Modal>
  );
}
