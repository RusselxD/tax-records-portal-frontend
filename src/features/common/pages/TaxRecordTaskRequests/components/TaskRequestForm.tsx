import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button, Dropdown, Input } from "../../../../../components/common";
import { taxRecordTaskAPI } from "../../../../../api/tax-record-task";
import { taxRecordTaskRequestAPI } from "../../../../../api/tax-record-task-request";
import { clientAPI } from "../../../../../api/client";
import { useToast } from "../../../../../contexts/ToastContext";
import { getErrorMessage, isConflictError } from "../../../../../lib/api-error";
import { PERIOD, type Period } from "../../../../../types/tax-record-task";
import type { TaxRecordLookupResponse, LookupResponse } from "../../../../../types/tax-record-task";

const periodOptions = [
  { label: "January", value: PERIOD.JAN },
  { label: "February", value: PERIOD.FEB },
  { label: "March", value: PERIOD.MAR },
  { label: "April", value: PERIOD.APR },
  { label: "May", value: PERIOD.MAY },
  { label: "June", value: PERIOD.JUN },
  { label: "July", value: PERIOD.JUL },
  { label: "August", value: PERIOD.AUG },
  { label: "September", value: PERIOD.SEP },
  { label: "October", value: PERIOD.OCT },
  { label: "November", value: PERIOD.NOV },
  { label: "December", value: PERIOD.DEC },
  { label: "Q1", value: PERIOD.Q1 },
  { label: "Q2", value: PERIOD.Q2 },
  { label: "Q3", value: PERIOD.Q3 },
  { label: "Q4", value: PERIOD.Q4 },
  { label: "Annually", value: PERIOD.ANNUALLY },
];

interface TaskRequestFormProps {
  /** Pre-selected client. When omitted, the form renders a client picker. */
  clientId?: string;
  clientDisplayName?: string;
  onCancel: () => void;
  onSuccess: (requestId: string) => void;
}

export default function TaskRequestForm({
  clientId: fixedClientId,
  clientDisplayName,
  onCancel,
  onSuccess,
}: TaskRequestFormProps) {
  const { toastSuccess, toastError } = useToast();

  const needsClientPicker = fixedClientId == null;

  const [pickedClientId, setPickedClientId] = useState("");
  const [clients, setClients] = useState<LookupResponse[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [taskNameId, setTaskNameId] = useState<number | null>(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [period, setPeriod] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const [categories, setCategories] = useState<TaxRecordLookupResponse[]>([]);
  const [subCategories, setSubCategories] = useState<TaxRecordLookupResponse[]>([]);
  const [taskNames, setTaskNames] = useState<TaxRecordLookupResponse[]>([]);
  const [isLoadingRefs, setIsLoadingRefs] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetches: Promise<unknown>[] = [
      taxRecordTaskAPI.getCategories().then((data) => {
        if (!cancelled) setCategories(data);
      }),
    ];
    if (needsClientPicker) {
      fetches.push(
        clientAPI.getActiveClients().then((data) => {
          if (!cancelled) setClients(data);
        }),
      );
    }
    Promise.all(fetches.map((p) => p.catch(() => {}))).finally(() => {
      if (!cancelled) setIsLoadingRefs(false);
    });
    return () => {
      cancelled = true;
    };
  }, [needsClientPicker]);

  useEffect(() => {
    if (categoryId == null) {
      setSubCategories([]);
      setSubCategoryId(null);
      setTaskNames([]);
      setTaskNameId(null);
      return;
    }
    let cancelled = false;
    taxRecordTaskAPI
      .getSubCategories(categoryId)
      .then((data) => {
        if (!cancelled) {
          setSubCategories(data);
          setSubCategoryId(null);
          setTaskNames([]);
          setTaskNameId(null);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  useEffect(() => {
    if (subCategoryId == null) {
      setTaskNames([]);
      setTaskNameId(null);
      return;
    }
    let cancelled = false;
    taxRecordTaskAPI
      .getTaskNamesForSubCategory(subCategoryId)
      .then((data) => {
        if (!cancelled) {
          setTaskNames(data);
          setTaskNameId(null);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [subCategoryId]);

  useEffect(() => {
    setDuplicateError(null);
  }, [categoryId, subCategoryId, taskNameId, year, period]);

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.displayName }));
  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));
  const subCategoryOptions = subCategories.map((c) => ({ value: String(c.id), label: c.name }));
  const taskNameOptions = taskNames.map((c) => ({ value: String(c.id), label: c.name }));

  const effectiveClientId = fixedClientId ?? pickedClientId;

  const canSubmit =
    effectiveClientId !== "" &&
    categoryId != null &&
    subCategoryId != null &&
    taskNameId != null &&
    year.trim() !== "" &&
    period !== "";

  useEffect(() => {
    setDuplicateError(null);
  }, [pickedClientId]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setDuplicateError(null);
    try {
      const res = await taxRecordTaskRequestAPI.create({
        clientId: effectiveClientId,
        categoryId: categoryId!,
        subCategoryId: subCategoryId!,
        taskNameId: taskNameId!,
        year: Number(year),
        period: period as Period,
        notes: notes.trim() || null,
      });
      toastSuccess("Request Submitted", "Your task request has been sent for review.");
      onSuccess(res.id);
    } catch (err) {
      if (isConflictError(err)) {
        setDuplicateError(
          "A pending request already exists for this client, task, year, and period.",
        );
      } else {
        toastError(getErrorMessage(err, "Failed to submit request."));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    canSubmit,
    effectiveClientId,
    categoryId,
    subCategoryId,
    taskNameId,
    year,
    period,
    notes,
    toastSuccess,
    toastError,
    onSuccess,
  ]);

  if (isLoadingRefs) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {needsClientPicker ? (
        <Dropdown
          label="Client"
          options={clientOptions}
          value={pickedClientId}
          onChange={setPickedClientId}
          placeholder="Select client"
        />
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-primary">
            {clientDisplayName}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Dropdown
          label="Category"
          options={categoryOptions}
          value={categoryId != null ? String(categoryId) : ""}
          onChange={(v) => setCategoryId(v ? Number(v) : null)}
          placeholder="Select category"
        />
        <Dropdown
          label="Sub Category"
          options={subCategoryOptions}
          value={subCategoryId != null ? String(subCategoryId) : ""}
          onChange={(v) => setSubCategoryId(v ? Number(v) : null)}
          placeholder={categoryId == null ? "Select category first" : "Select sub-category"}
          disabled={categoryId == null}
        />
        <Dropdown
          label="Task Name"
          options={taskNameOptions}
          value={taskNameId != null ? String(taskNameId) : ""}
          onChange={(v) => setTaskNameId(v ? Number(v) : null)}
          placeholder={subCategoryId == null ? "Select sub-category first" : "Select task name"}
          disabled={subCategoryId == null}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2026"
        />
        <Dropdown
          label="Period"
          options={periodOptions}
          value={period}
          onChange={setPeriod}
          placeholder="Select period"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add context for the reviewer..."
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-primary placeholder-gray-400 resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
        />
      </div>

      {duplicateError && (
        <p className="text-sm text-status-rejected">{duplicateError}</p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!canSubmit}>
          Submit Request
        </Button>
      </div>
    </div>
  );
}
