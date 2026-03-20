import { ChevronRight } from "lucide-react";
import type { DrillDownItem } from "../../../../../types/tax-record";

interface DrillDownListProps {
  items: DrillDownItem[];
  levelLabel: string;
  onSelect: (item: DrillDownItem) => void;
}

export default function DrillDownList({ items, levelLabel, onSelect }: DrillDownListProps) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        {levelLabel}
      </p>
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {items.map((item) => (
          <button
            key={String(item.id)}
            onClick={() => onSelect(item)}
            className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors group first:rounded-t-lg last:rounded-b-lg"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-medium text-primary leading-relaxed">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">
                {item.count} {item.count === 1 ? "record" : "records"}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-accent transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
