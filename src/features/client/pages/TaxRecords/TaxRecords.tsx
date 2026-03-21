import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, AlertTriangle, FolderOpen } from "lucide-react";
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
  TaxRecordEntryResponse,
} from "../../../../types/tax-record";
import { DRILL_DOWN_LEVEL } from "../../../../types/tax-record";
import Breadcrumbs from "./components/Breadcrumbs";
import DrillDownList from "./components/DrillDownList";
import TaxRecordDetail from "./components/TaxRecordDetail";

const LEVEL_ORDER = [
  DRILL_DOWN_LEVEL.CATEGORY,
  DRILL_DOWN_LEVEL.SUB_CATEGORY,
  DRILL_DOWN_LEVEL.TASK_NAME,
  DRILL_DOWN_LEVEL.YEAR,
  DRILL_DOWN_LEVEL.PERIOD,
  DRILL_DOWN_LEVEL.RECORD,
] as const;

const LEVEL_LABELS: Record<string, string> = {
  category: "Categories",
  subCategory: "Sub Categories",
  taskName: "Task Names",
  year: "Years",
  period: "Periods",
};

function buildFilters(selections: DrillSelection[]): DrillDownFilters {
  const filters: DrillDownFilters = {};
  if (selections.length >= 1) filters.categoryId = Number(selections[0].id);
  if (selections.length >= 2) filters.subCategoryId = Number(selections[1].id);
  if (selections.length >= 3) filters.taskNameId = Number(selections[2].id);
  if (selections.length >= 4) filters.year = Number(selections[3].id);
  if (selections.length >= 5) filters.period = selections[4].id as Period;
  return filters;
}

export default function TaxRecords() {
  usePageTitle("Tax Records");

  const location = useLocation();
  const initialSelections = (location.state as { selections?: DrillSelection[] })?.selections ?? [];

  const [selections, setSelections] = useState<DrillSelection[]>(initialSelections);
  const [items, setItems] = useState<DrillDownItem[]>([]);
  const [record, setRecord] = useState<TaxRecordEntryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentLevel = LEVEL_ORDER[selections.length];
  const isRecordLevel = currentLevel === DRILL_DOWN_LEVEL.RECORD;

  const fetchLevel = useCallback(async (sels: DrillSelection[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = buildFilters(sels);
      const res: DrillDownResponse = await taxRecordAPI.drillDown(filters);

      if (res.level === "record") {
        setRecord(res.record);
        setItems([]);
      } else {
        setItems(res.items);
        setRecord(null);
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
    setSelections((prev) => [...prev, { id: item.id, label: item.label }]);
  }, []);

  const handleBreadcrumbClick = useCallback((index: number) => {
    setSelections((prev) => prev.slice(0, index));
  }, []);

  return (
    <div className="pb-12">
      <Breadcrumbs
        selections={selections}
        onNavigate={handleBreadcrumbClick}
      />

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
        />
      )}

      {!isLoading && !error && isRecordLevel && record && (
        <TaxRecordDetail record={record} />
      )}
    </div>
  );
}
