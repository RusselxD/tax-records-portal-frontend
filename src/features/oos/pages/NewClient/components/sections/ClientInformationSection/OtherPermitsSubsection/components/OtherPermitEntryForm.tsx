import { Trash2 } from "lucide-react";
import { Input } from "../../../../../../../../../components/common";
import type { OtherPermitDetails } from "../../../../../../../../../types/client-info";
import DateFieldInput from "../../../DateFieldInput";

interface OtherPermitEntryFormProps {
  entry: OtherPermitDetails;
  index: number;
  onUpdate: (index: number, fields: Partial<OtherPermitDetails>) => void;
  onRemove: (index: number) => void;
}

export default function OtherPermitEntryForm({
  entry,
  index,
  onUpdate,
  onRemove,
}: OtherPermitEntryFormProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-primary">
          Other Permit #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
          title="Remove entry"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Government Agency"
            value={entry.governmentAgency ?? ""}
            onChange={(e) =>
              onUpdate(index, { governmentAgency: e.target.value || null })
            }
            placeholder="e.g. DENR, FDA, LTO"
          />
          <Input
            label="Registration Number"
            value={entry.registrationNumber ?? ""}
            onChange={(e) =>
              onUpdate(index, { registrationNumber: e.target.value || null })
            }
            placeholder="Enter registration number"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateFieldInput
            label="Date of Registration"
            value={entry.dateOfRegistration}
            onChange={(v) => onUpdate(index, { dateOfRegistration: v })}
          />
          <DateFieldInput
            label="Date of Expiration"
            value={entry.dateOfExpiration}
            onChange={(v) => onUpdate(index, { dateOfExpiration: v })}
          />
        </div>
      </div>
    </div>
  );
}
