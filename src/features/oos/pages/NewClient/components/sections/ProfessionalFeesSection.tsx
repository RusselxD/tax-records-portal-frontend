import { Plus, Trash2 } from "lucide-react";
import { Input, Button } from "../../../../../../components/common";
import type { ProfessionalFeeEntry } from "../../../../../../types/client-info";

interface ProfessionalFeesSectionProps {
  data: ProfessionalFeeEntry[];
  onChange: (data: ProfessionalFeeEntry[]) => void;
}

function emptyFee(): ProfessionalFeeEntry {
  return { serviceName: null, fee: null };
}

export default function ProfessionalFeesSection({
  data,
  onChange,
}: ProfessionalFeesSectionProps) {
  const updateItem = (index: number, fields: Partial<ProfessionalFeeEntry>) => {
    const updated = data.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onChange(updated);
  };

  const addItem = () => onChange([...data, emptyFee()]);

  const removeItem = (index: number) =>
    onChange(data.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {data.map((entry, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-4"
        >
          <div className="grid flex-1 grid-cols-2 gap-4">
            <Input
              label="Service Name"
              value={entry.serviceName ?? ""}
              onChange={(e) =>
                updateItem(index, { serviceName: e.target.value || null })
              }
              placeholder="e.g. Monthly Bookkeeping"
            />
            <Input
              label="Fee"
              value={entry.fee ?? ""}
              onChange={(e) =>
                updateItem(index, { fee: e.target.value || null })
              }
              placeholder="e.g. ₱5,000/month"
            />
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="mt-7 shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
            title="Remove entry"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <Button variant="secondary" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add Service Fee
      </Button>
    </div>
  );
}
