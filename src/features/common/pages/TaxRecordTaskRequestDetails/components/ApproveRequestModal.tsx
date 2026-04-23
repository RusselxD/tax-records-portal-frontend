import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import { Button, Input, MultiSelect } from "../../../../../components/common";
import { taxRecordTaskRequestAPI } from "../../../../../api/tax-record-task-request";
import { clientAPI } from "../../../../../api/client";
import { useToast } from "../../../../../contexts/ToastContext";
import { getErrorMessage } from "../../../../../lib/api-error";
import { periodLabels } from "../../../../../constants/tax-record-task";
import type { ClientAccountantResponse } from "../../../../../types/client";
import type { TaxRecordTaskRequestDetailResponse } from "../../../../../types/tax-record-task-request";

interface ApproveRequestModalProps {
  request: TaxRecordTaskRequestDetailResponse;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: (taskId: string) => void;
}

export default function ApproveRequestModal({
  request,
  setModalOpen,
  onSuccess,
}: ApproveRequestModalProps) {
  const { toastSuccess, toastError } = useToast();
  const [deadline, setDeadline] = useState("");
  const [assignedToIds, setAssignedToIds] = useState<string[]>([request.requester.id]);
  const [accountants, setAccountants] = useState<ClientAccountantResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    clientAPI
      .getClientAccountants(request.clientId)
      .then((data) => {
        if (!cancelled) setAccountants(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [request.clientId]);

  const accountantOptions = accountants.map((a) => ({
    value: a.id,
    label: a.displayName,
  }));

  const canSubmit = deadline !== "" && assignedToIds.length > 0;

  const handleApprove = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const res = await taxRecordTaskRequestAPI.approve(request.id, {
        deadline,
        assignedToIds,
      });
      toastSuccess("Request Approved", "The task has been created and assigned.");
      setModalOpen(false);
      if (res.resultingTaskId) {
        onSuccess(res.resultingTaskId);
      }
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to approve request."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalContainer setModalOpen={setModalOpen}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-primary">Approve Task Request</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              This will create the task and notify the requester.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500 shrink-0">Client</span>
              <span className="font-medium text-primary text-right">
                {request.clientDisplayName}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500 shrink-0">Category</span>
              <span className="font-medium text-primary text-right">
                {request.categoryName} &middot; {request.subCategoryName}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500 shrink-0">Task</span>
              <span className="font-medium text-primary text-right">
                {request.taskName}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500 shrink-0">Year / Period</span>
              <span className="font-medium text-primary text-right">
                {request.year} &middot; {periodLabels[request.period] ?? request.period}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500 shrink-0">Requester</span>
              <span className="font-medium text-primary text-right">
                {request.requester.name}
              </span>
            </div>
          </div>

          <Input
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <MultiSelect
            label="Assigned To"
            options={accountantOptions}
            value={assignedToIds}
            onChange={setAssignedToIds}
            placeholder="Select accountants"
          />
          <p className="text-xs text-gray-400 -mt-3">
            Defaults to the requester. You can reassign to a teammate if needed.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleApprove} isLoading={isSubmitting} disabled={!canSubmit}>
            Approve & Create Task
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
}
