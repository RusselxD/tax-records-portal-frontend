import { Plus, Trash2 } from "lucide-react";
import { Input, Button } from "../../../../../../../../components/common";
import type { PendingActionItem } from "../../../../../../../../types/client-info";

interface PendingActionItemsListProps {
  items: PendingActionItem[];
  onUpdate: (index: number, fields: Partial<PendingActionItem>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function PendingActionItemsList({
  items,
  onUpdate,
  onAdd,
  onRemove,
}: PendingActionItemsListProps) {
  return (
    <div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item._uid ?? index} className="flex items-end gap-3">
            <div className="grid flex-1 grid-cols-2 gap-4">
              <Input
                label="Particulars"
                value={item.particulars ?? ""}
                onChange={(e) =>
                  onUpdate(index, {
                    particulars: e.target.value || null,
                  })
                }
                placeholder="Action item"
              />
              <Input
                label="Notes"
                value={item.notes ?? ""}
                onChange={(e) =>
                  onUpdate(index, { notes: e.target.value || null })
                }
                placeholder="Notes"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="mb-1 shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button variant="secondary" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Action Item
        </Button>
      </div>
    </div>
  );
}
