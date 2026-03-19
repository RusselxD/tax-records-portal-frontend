import { useState } from "react";
import { getErrorMessage } from "../../../../../../../lib/api-error";
import { Check, Loader2, X } from "lucide-react";
import { usersAPI } from "../../../../../../../api/users";
import type { PositionListItem } from "../../../../../../../types/user";

interface PositionInlineCreateProps {
  onCreated: (position: PositionListItem) => void;
  onCancel: () => void;
}

export default function PositionInlineCreate({
  onCreated,
  onCancel,
}: PositionInlineCreateProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setError(null);
    setIsSaving(true);
    try {
      const created = await usersAPI.createEmployeePosition(trimmed);
      onCreated(created);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create position."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="e.g. Senior Tax Consultant"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCreate();
            }
            if (e.key === "Escape") onCancel();
          }}
          className={`flex-1 rounded-md border px-3 py-2.5 text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-1 ${
            error
              ? "border-status-rejected focus:border-status-rejected focus:ring-status-rejected"
              : "border-gray-300 focus:border-primary/40 focus:ring-primary/20"
          }`}
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={isSaving || !name.trim()}
          className="p-2 rounded-md text-white bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <p className="text-xs text-status-rejected">{error}</p>
      )}
    </div>
  );
}
