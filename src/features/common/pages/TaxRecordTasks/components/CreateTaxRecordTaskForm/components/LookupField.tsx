import { useState } from "react";
import { Plus, Check, Loader2, X } from "lucide-react";
import { Dropdown } from "../../../../../../../components/common";
import { getErrorMessage, isConflictError } from "../../../../../../../lib/api-error";
import { useToast } from "../../../../../../../contexts/ToastContext";
import type { TaxRecordLookupResponse } from "../../../../../../../types/tax-record-task";

interface LookupFieldProps {
  label: string;
  placeholder: string;
  options: TaxRecordLookupResponse[];
  value: number | null;
  onChange: (id: number | null) => void;
  onOptionsChange: (options: TaxRecordLookupResponse[]) => void;
  onCreate: (name: string) => Promise<TaxRecordLookupResponse>;
  onDelete: (id: number) => Promise<void>;
  disabled?: boolean;
  createPlaceholder?: string;
}

export default function LookupField({
  label,
  placeholder,
  options,
  value,
  onChange,
  onOptionsChange,
  onCreate,
  onDelete,
  disabled = false,
  createPlaceholder = "Enter name...",
}: LookupFieldProps) {
  const { toastError } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const dropdownOptions = options.map((o) => ({
    value: String(o.id),
    label: o.name,
  }));

  const handleCreate = async () => {
    const trimmed = createName.trim();
    if (!trimmed) return;
    setCreateError(null);
    setIsCreating(true);
    try {
      const created = await onCreate(trimmed);
      onOptionsChange([...options, created]);
      onChange(created.id);
      setCreateName("");
      setShowCreate(false);
    } catch (err) {
      if (isConflictError(err)) {
        setCreateError("Already exists.");
      } else {
        setCreateError(getErrorMessage(err, "Failed to create."));
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteOption = async (optionValue: string) => {
    const id = Number(optionValue);
    const prev = options;
    const wasSelected = value === id;

    // Optimistic
    onOptionsChange(options.filter((o) => o.id !== id));
    if (wasSelected) onChange(null);

    try {
      await onDelete(id);
    } catch (err) {
      // Restore
      onOptionsChange(prev);
      if (wasSelected) onChange(id);
      toastError(getErrorMessage(err, "Cannot delete — it's referenced elsewhere."));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {!disabled && (
          <button
            type="button"
            onClick={() => {
              setShowCreate((v) => !v);
              setCreateName("");
              setCreateError(null);
            }}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
          >
            {showCreate ? (
              <>
                <X className="w-3 h-3" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                Add New
              </>
            )}
          </button>
        )}
      </div>

      {showCreate ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={createName}
              onChange={(e) => { setCreateName(e.target.value); setCreateError(null); }}
              placeholder={createPlaceholder}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleCreate(); }
                if (e.key === "Escape") { setShowCreate(false); setCreateName(""); setCreateError(null); }
              }}
              className={`flex-1 rounded-md border px-3 py-2.5 text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-1 ${
                createError
                  ? "border-status-rejected focus:border-status-rejected focus:ring-status-rejected"
                  : "border-gray-300 focus:border-primary/40 focus:ring-primary/20"
              }`}
            />
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || !createName.trim()}
              className="p-2.5 rounded-md text-white bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
          </div>
          {createError && <p className="text-xs text-status-rejected">{createError}</p>}
        </div>
      ) : (
        <Dropdown
          options={dropdownOptions}
          value={value != null ? String(value) : ""}
          onChange={(v) => onChange(v ? Number(v) : null)}
          placeholder={placeholder}
          disabled={disabled}
          onDeleteOption={handleDeleteOption}
        />
      )}
    </div>
  );
}
