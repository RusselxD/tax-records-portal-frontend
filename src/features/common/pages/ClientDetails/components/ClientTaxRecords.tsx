import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertTriangle, FolderOpen } from "lucide-react";
import Breadcrumbs from "../../../../client/pages/TaxRecords/components/Breadcrumbs";
import { taxRecordAPI } from "../../../../../api/tax-record";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useDownload } from "../../../../../contexts/DownloadContext";
import { Button } from "../../../../../components/common";
import type { Period } from "../../../../../types/tax-record-task";
import type {
  DrillDownResponse,
  DrillDownFilters,
  DrillSelection,
  DrillDownItem,
  DrillDownLevel,
  TaxRecordEntryResponse,
} from "../../../../../types/tax-record";
import { DRILL_DOWN_LEVEL } from "../../../../../types/tax-record";
import DrillDownList from "../../../../client/pages/TaxRecords/components/DrillDownList";
import TaxRecordDetail from "../../../../client/pages/TaxRecords/components/TaxRecordDetail";

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

export default function ClientTaxRecords({ clientId }: { clientId: string }) {
  const [selections, setSelections] = useState<DrillSelection[]>([]);
  const [items, setItems] = useState<DrillDownItem[]>([]);
  const [record, setRecord] = useState<TaxRecordEntryResponse | null>(null);
  const [currentLevel, setCurrentLevel] = useState<DrillDownLevel>(DRILL_DOWN_LEVEL.CATEGORY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isRecordLevel = currentLevel === DRILL_DOWN_LEVEL.RECORD;

  const fetchLevel = useCallback(async (sels: DrillSelection[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = buildFilters(sels);
      const res: DrillDownResponse = await taxRecordAPI.clientDrillDown(clientId, filters);

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
  }, [clientId]);

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
      taxRecordAPI.clientBulkDownload(clientId, {
        level: currentLevel as Exclude<DrillDownLevel, "record" | "version">,
        ...filters,
        selectedIds,
      }),
    );
  }, [selections, currentLevel, clientId, startDownload]);

  return (
    <div>
      <Breadcrumbs selections={selections} onNavigate={handleBreadcrumbClick} />

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-6 w-6 text-gray-400 mb-3" />
          <p className="text-sm text-status-rejected mb-3">{error}</p>
          <Button variant="secondary" onClick={() => fetchLevel(selections)}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !error && !isRecordLevel && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">No completed tax records</p>
          <p className="text-sm text-gray-400 mt-1">
            Finalized tax records will appear here once tasks are completed.
          </p>
        </div>
      )}

      {!isLoading && !error && !isRecordLevel && items.length > 0 && (
        <DrillDownList
          items={items}
          levelLabel={LEVEL_LABELS[currentLevel]}
          onSelect={handleSelect}
          onBulkDownload={handleBulkDownload}
        />
      )}

      {!isLoading && !error && isRecordLevel && record && (
        <TaxRecordDetail record={record} />
      )}
    </div>
  );
}
