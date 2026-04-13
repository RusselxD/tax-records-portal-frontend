import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, AlertTriangle, FolderOpen, ShieldAlert } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { taxRecordAPI } from "../../../../api/tax-record";
import { getErrorMessage } from "../../../../lib/api-error";
import { Button } from "../../../../components/common";
import type { Period } from "../../../../types/tax-record-task";
import type {
  DrillDownResponse,
  DrillDownFilters,
  DrillSelection,
  DrillDownItem,
  DrillDownLevel,
  TaxRecordEntryResponse,
} from "../../../../types/tax-record";
import { DRILL_DOWN_LEVEL } from "../../../../types/tax-record";
import { useDownload } from "../../../../contexts/DownloadContext";
import Breadcrumbs from "./components/Breadcrumbs";
import DrillDownList from "./components/DrillDownList";
import TaxRecordDetail from "./components/TaxRecordDetail";

const LEVEL_LABELS: Record<string, string> = {
  category: "Categories",
  subCategory: "Sub Categories",
  taskName: "Task Names",
  year: "Years",
  period: "Periods",
  version: "Versions",
};

function buildFilters(selections: DrillSelection[]): DrillDownFilters {
  const filters: DrillDownFilters = {};
  for (const sel of selections) {
    switch (sel.kind) {
      case "category":
        filters.categoryId = Number(sel.id);
        break;
      case "subCategory":
        filters.subCategoryId = Number(sel.id);
        break;
      case "taskName":
        filters.taskNameId = Number(sel.id);
        break;
      case "year":
        filters.year = Number(sel.id);
        break;
      case "period":
        filters.period = sel.id as Period;
        break;
      case "version":
        filters.version = Number(sel.id);
        break;
    }
  }
  return filters;
}

export default function TaxRecords() {
  usePageTitle("Tax Records");

  const location = useLocation();
  const initialSelections = (location.state as { selections?: DrillSelection[] })?.selections ?? [];

  const [selections, setSelections] = useState<DrillSelection[]>(initialSelections);
  const [items, setItems] = useState<DrillDownItem[]>([]);
  const [record, setRecord] = useState<TaxRecordEntryResponse | null>(null);
  const [currentLevel, setCurrentLevel] = useState<DrillDownLevel>(DRILL_DOWN_LEVEL.CATEGORY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProtected, setIsProtected] = useState(false);

  const isRecordLevel = currentLevel === DRILL_DOWN_LEVEL.RECORD;

  const fetchLevel = useCallback(async (sels: DrillSelection[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = buildFilters(sels);
      const res: DrillDownResponse = await taxRecordAPI.drillDown(filters);

      if (res.taxRecordsProtected) setIsProtected(true);

      if (res.level === "record") {
        setRecord(res.record);
        setItems([]);
        setCurrentLevel(DRILL_DOWN_LEVEL.RECORD);
      } else {
        setItems(res.items);
        setRecord(null);
        setCurrentLevel(res.level);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load tax records"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLevel(selections);
  }, [selections, fetchLevel]);

  const handleSelect = useCallback((item: DrillDownItem) => {
    setSelections((prev) => [...prev, { id: item.id, label: item.label, kind: currentLevel }]);
  }, [currentLevel]);

  const handleBreadcrumbClick = useCallback((index: number) => {
    setSelections((prev) => prev.slice(0, index));
  }, []);

  const { startDownload } = useDownload();

  const handleBulkDownload = useCallback((selectedIds: string[]) => {
    if (currentLevel === DRILL_DOWN_LEVEL.RECORD || currentLevel === DRILL_DOWN_LEVEL.VERSION) return;
    const filters = buildFilters(selections);
    startDownload("Tax Records", () =>
      taxRecordAPI.bulkDownload({
        level: currentLevel as Exclude<DrillDownLevel, "record" | "version">,
        ...filters,
        selectedIds,
      }),
    );
  }, [selections, currentLevel, startDownload]);

  return (
    <div className="pb-12">
      <Breadcrumbs
        selections={selections}
        onNavigate={handleBreadcrumbClick}
      />

      {isProtected && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-5">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            Your tax records are currently protected and unavailable for preview and download.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertTriangle className="h-6 w-6 text-gray-400 mb-3" />
          <p className="text-sm text-status-rejected mb-3">{error}</p>
          <Button variant="secondary" onClick={() => fetchLevel(selections)}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !error && !isRecordLevel && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">No tax records found</p>
          <p className="text-sm text-gray-400 mt-1">
            Your finalized tax records will appear here
          </p>
        </div>
      )}

      {!isLoading && !error && !isRecordLevel && items.length > 0 && (
        <DrillDownList
          items={items}
          levelLabel={LEVEL_LABELS[currentLevel]}
          onSelect={handleSelect}
          onBulkDownload={handleBulkDownload}
          downloadDisabled={isProtected}
        />
      )}

      {!isLoading && !error && isRecordLevel && record && (
        <TaxRecordDetail record={record} protected={isProtected} />
      )}
    </div>
  );
}
