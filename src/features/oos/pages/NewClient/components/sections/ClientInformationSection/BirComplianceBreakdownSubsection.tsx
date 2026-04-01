import { uid } from "../../../../../../../lib/uid";
import { Plus, Trash2 } from "lucide-react";
import { Input, Button } from "../../../../../../../components/common";
import type {
  BirComplianceBreakdown,
  BirComplianceItem,
} from "../../../../../../../types/client-info";

interface BirComplianceBreakdownSubsectionProps {
  data: BirComplianceBreakdown;
  onChange: (data: BirComplianceBreakdown) => void;
}

function emptyItem(): BirComplianceItem {
  return {
    _uid: uid(),
    category: null,
    taxReturnName: null,
    deadline: null,
    applicable: true,
    notes: null,
  };
}

export default function BirComplianceBreakdownSubsection({
  data,
  onChange,
}: BirComplianceBreakdownSubsectionProps) {
  const updateItem = (index: number, fields: Partial<BirComplianceItem>) => {
    const updated = data.items.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onChange({ ...data, items: updated });
  };

  const addItem = () => onChange({ ...data, items: [...data.items, emptyItem()] });

  const removeItem = (index: number) =>
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });

  return (
    <div className="space-y-4">
      {data.items.map((entry, index) => (
        <div
          key={entry._uid ?? index}
          className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-primary">
                Item #{index + 1}
              </span>
              <label className="flex items-center gap-1.5 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={entry.applicable}
                  onChange={(e) =>
                    updateItem(index, { applicable: e.target.checked })
                  }
                  className="rounded border-gray-300 text-accent focus:ring-accent"
                />
                Applicable
              </label>
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
              title="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Category"
                value={entry.category ?? ""}
                onChange={(e) =>
                  updateItem(index, { category: e.target.value || null })
                }
                placeholder="e.g. Income Tax"
              />
              <Input
                label="Tax Return Name"
                value={entry.taxReturnName ?? ""}
                onChange={(e) =>
                  updateItem(index, {
                    taxReturnName: e.target.value || null,
                  })
                }
                placeholder="e.g. BIR Form 1701Q"
              />
              <Input
                label="Deadline"
                value={entry.deadline ?? ""}
                onChange={(e) =>
                  updateItem(index, { deadline: e.target.value || null })
                }
                placeholder="e.g. Every 15th"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">
                Notes
              </label>
              <textarea
                value={entry.notes ?? ""}
                onChange={(e) =>
                  updateItem(index, { notes: e.target.value || null })
                }
                placeholder="Additional notes..."
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-primary placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 focus:border-primary/40 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-start gap-4">
        <Button variant="secondary" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Compliance Item
        </Button>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-primary">
          Others (Specify)
        </label>
        <textarea
          value={data.othersSpecify ?? ""}
          onChange={(e) =>
            onChange({ ...data, othersSpecify: e.target.value || null })
          }
          placeholder="Specify other compliance items..."
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-primary placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 focus:border-primary/40 focus:ring-primary/20 resize-none"
        />
      </div>
    </div>
  );
}
