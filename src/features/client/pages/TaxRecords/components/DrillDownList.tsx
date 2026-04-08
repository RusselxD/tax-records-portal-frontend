import { useState, useCallback } from "react";
import { ChevronRight, Download, CheckSquare } from "lucide-react";
import type { DrillDownItem } from "../../../../../types/tax-record";

interface DrillDownListProps {
  items: DrillDownItem[];
  levelLabel: string;
  onSelect: (item: DrillDownItem) => void;
  onBulkDownload?: (selectedIds: string[]) => void;
  downloadDisabled?: boolean;
}

export default function DrillDownList({
  items,
  levelLabel,
  onSelect,
  onBulkDownload,
  downloadDisabled,
}: DrillDownListProps) {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const canSelect = !!onBulkDownload && !downloadDisabled;
  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0;

  const enterSelectMode = useCallback(() => {
    setSelectMode(true);
    setSelectedIds(new Set());
  }, []);

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  const toggleItem = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.size === items.length ? new Set() : new Set(items.map((i) => String(i.id))),
    );
  }, [items]);

  const handleDownload = useCallback(() => {
    if (!onBulkDownload || selectedIds.size === 0) return;
    onBulkDownload(Array.from(selectedIds));
    exitSelectMode();
  }, [onBulkDownload, selectedIds, exitSelectMode]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {selectMode && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected;
                }}
                onChange={toggleAll}
                className="rounded border-gray-300 text-accent focus:ring-accent h-3.5 w-3.5"
              />
              <span className="text-xs font-medium text-gray-500">Select all</span>
            </label>
          )}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {levelLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectMode && someSelected && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-primary hover:bg-gray-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download ({selectedIds.size})
            </button>
          )}
          {canSelect && !selectMode && (
            <button
              onClick={enterSelectMode}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Select
            </button>
          )}
          {selectMode && (
            <button
              onClick={exitSelectMode}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const isSelected = selectedIds.has(String(item.id));
          return (
            <div
              key={String(item.id)}
              className={`flex items-center w-full px-5 py-4 bg-white border rounded-lg transition-colors group ${
                isSelected ? "border-accent/50 bg-accent/5" : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {selectMode && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onClick={(e) => toggleItem(String(item.id), e)}
                  onChange={() => {}}
                  className="rounded border-gray-300 text-accent focus:ring-accent h-3.5 w-3.5 mr-3 shrink-0 cursor-pointer"
                />
              )}
              <button
                onClick={() =>
                  selectMode
                    ? setSelectedIds((prev) => {
                        const next = new Set(prev);
                        const key = String(item.id);
                        if (next.has(key)) next.delete(key);
                        else next.add(key);
                        return next;
                      })
                    : onSelect(item)
                }
                className="flex items-center justify-between flex-1 min-w-0 text-left"
              >
                <span className="text-sm font-medium text-primary leading-relaxed min-w-0 truncate pr-3">
                  {item.label}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full px-2.5 py-1">
                    {item.count} {item.count === 1 ? "record" : "records"}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-accent transition-colors" />
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
