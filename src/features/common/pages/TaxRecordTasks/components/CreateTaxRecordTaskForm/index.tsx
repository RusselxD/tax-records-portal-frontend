import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button, Dropdown, Input, MultiSelect } from "../../../../../../components/common";
import { taxRecordTaskAPI } from "../../../../../../api/tax-record-task";
import { clientAPI } from "../../../../../../api/client";
import { useToast } from "../../../../../../contexts/ToastContext";
import { getErrorMessage } from "../../../../../../lib/api-error";
import { PERIOD, type Period } from "../../../../../../types/tax-record-task";
import type { TaxRecordLookupResponse } from "../../../../../../types/tax-record-task";
import type { LookupResponse } from "../../../../../../types/tax-record-task";
import type { ClientAccountantResponse } from "../../../../../../types/client";
import LookupField from "./components/LookupField";

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

interface CreateTaxRecordTaskFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CreateTaxRecordTaskForm({ onCancel, onSuccess }: CreateTaxRecordTaskFormProps) {
  const { toastSuccess, toastError } = useToast();

  // Form state
  const [clientId, setClientId] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [taskNameId, setTaskNameId] = useState<number | null>(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [period, setPeriod] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToIds, setAssignedToIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lookup data
  const [clients, setClients] = useState<LookupResponse[]>([]);
  const [accountants, setAccountants] = useState<ClientAccountantResponse[]>([]);
  const [categories, setCategories] = useState<TaxRecordLookupResponse[]>([]);
  const [subCategories, setSubCategories] = useState<TaxRecordLookupResponse[]>([]);
  const [taskNames, setTaskNames] = useState<TaxRecordLookupResponse[]>([]);
  const [isLoadingRefs, setIsLoadingRefs] = useState(true);

  // Fetch clients + categories on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchRefs() {
      try {
        const [clientsData, categoriesData] = await Promise.all([
          clientAPI.getActiveClients(),
          taxRecordTaskAPI.getCategories(),
        ]);
        if (!cancelled) {
          setClients(clientsData);
          setCategories(categoriesData);
        }
      } catch {
        // silently fail — dropdowns will be empty
      } finally {
        if (!cancelled) setIsLoadingRefs(false);
      }
    }
    fetchRefs();
    return () => { cancelled = true; };
  }, []);

  // Fetch assigned accountants when client changes
  useEffect(() => {
    setAccountants([]);
    setAssignedToIds([]);
    if (!clientId) return;
    let cancelled = false;
    clientAPI.getClientAccountants(clientId).then((data) => {
      if (!cancelled) setAccountants(data);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [clientId]);

  // Fetch sub-categories when category changes
  useEffect(() => {
    if (categoryId == null) {
      setSubCategories([]);
      setSubCategoryId(null);
      setTaskNames([]);
      setTaskNameId(null);
      return;
    }
    let cancelled = false;
    taxRecordTaskAPI.getSubCategories(categoryId).then((data) => {
      if (!cancelled) {
        setSubCategories(data);
        setSubCategoryId(null);
        setTaskNames([]);
        setTaskNameId(null);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [categoryId]);

  // Fetch task names when sub-category changes
  useEffect(() => {
    if (subCategoryId == null) {
      setTaskNames([]);
      setTaskNameId(null);
      return;
    }
    let cancelled = false;
    taxRecordTaskAPI.getTaskNamesForSubCategory(subCategoryId).then((data) => {
      if (!cancelled) {
        setTaskNames(data);
        setTaskNameId(null);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [subCategoryId]);

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.displayName }));
  const accountantOptions = accountants.map((a) => ({ value: a.id, label: a.displayName }));

  const canSubmit = clientId && categoryId != null && subCategoryId != null && taskNameId != null
    && year && period && deadline && assignedToIds.length > 0;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await taxRecordTaskAPI.createTask({
        clientId,
        categoryId: categoryId!,
        subCategoryId: subCategoryId!,
        taskNameId: taskNameId!,
        year: Number(year),
        period: period as Period,
        deadline,
        description: description.trim() || null,
        assignedToIds,
      });
      toastSuccess("Task Created", "The tax record task has been created.");
      onSuccess();
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to create task."));
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, clientId, categoryId, subCategoryId, taskNameId, year, period, deadline, description, assignedToIds, toastSuccess, toastError, onSuccess]);

  if (isLoadingRefs) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 -ml-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-primary">New Tax Record Task</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-5">
          {/* Row 1: Client + Assigned To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Dropdown
                label="Client"
                options={clientOptions}
                value={clientId}
                onChange={setClientId}
                placeholder="Select client"
              />
            </div>
            <div>
              <MultiSelect
                label="Assigned To"
                options={accountantOptions}
                value={assignedToIds}
                onChange={setAssignedToIds}
                placeholder={clientId ? "Select accountants" : "Select a client first"}
                disabled={!clientId}
              />
            </div>
          </div>

          {/* Row 2: Category → Sub Category → Task Name (cascading) */}
          <div className="grid grid-cols-3 gap-4">
            <LookupField
              label="Category"
              placeholder="Select category"
              options={categories}
              value={categoryId}
              onChange={setCategoryId}
              onOptionsChange={setCategories}
              onCreate={(name) => taxRecordTaskAPI.createCategory(name)}
              onDelete={(id) => taxRecordTaskAPI.deleteCategory(id)}
              createPlaceholder="e.g. BIR Forms"
            />
            <LookupField
              label="Sub Category"
              placeholder="Select sub-category"
              options={subCategories}
              value={subCategoryId}
              onChange={setSubCategoryId}
              onOptionsChange={setSubCategories}
              onCreate={(name) => taxRecordTaskAPI.createSubCategory(categoryId!, name)}
              onDelete={(id) => taxRecordTaskAPI.deleteSubCategory(categoryId!, id)}
              disabled={categoryId == null}
              createPlaceholder="e.g. Monthly VAT"
            />
            <LookupField
              label="Task Name"
              placeholder="Select task name"
              options={taskNames}
              value={taskNameId}
              onChange={setTaskNameId}
              onOptionsChange={setTaskNames}
              onCreate={(name) => taxRecordTaskAPI.createTaskName(subCategoryId!, name)}
              onDelete={(id) => taxRecordTaskAPI.deleteTaskName(subCategoryId!, id)}
              disabled={subCategoryId == null}
              createPlaceholder="e.g. BIR Form 2550M"
            />
          </div>

          {/* Row 3: Year + Period + Deadline */}
          <div className="grid grid-cols-3 gap-4">
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
            <Input
              label="Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add notes or instructions..."
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-primary placeholder-gray-400 resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!canSubmit}>
            Create Task
          </Button>
        </div>
      </div>
    </div>
  );
}
