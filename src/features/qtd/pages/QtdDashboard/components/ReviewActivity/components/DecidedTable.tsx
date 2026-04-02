import { useCallback, useState } from "react";
import { TAX_RECORD_TASK_STATUS, type ReviewerDecidedItemResponse } from "../../../../../../../types/tax-record-task";
import { formatDate } from "../../../../../../../lib/formatters";
import { periodLabels } from "../../../../../../../constants/tax-record-task";
import { ResponsiveTable } from "../../../../../../../components/common";
import type { CardField } from "../../../../../../../components/common/ResponsiveTable";
import { CheckCheck, ChevronDown } from "lucide-react";

function DecisionBadge({ decision }: { decision: ReviewerDecidedItemResponse["decision"] }) {
  if (decision === TAX_RECORD_TASK_STATUS.APPROVED_FOR_FILING) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border bg-red-50 text-red-600 border-red-200">
      Rejected
    </span>
  );
}

export default function DecidedTable({
  tasks,
  onRowClick,
}: {
  tasks: ReviewerDecidedItemResponse[];
  onRowClick: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const keyExtractor = useCallback((t: ReviewerDecidedItemResponse) => t.id, []);

  const primaryFields = useCallback(
    (t: ReviewerDecidedItemResponse): CardField[] => [
      { label: "Client", value: t.clientName, stacked: true },
      {
        label: "Task",
        value: (
          <div>
            <span className="text-sm font-medium text-primary">{t.taskName}</span>
            <span className="block text-xs text-gray-400 mt-0.5">
              {t.categoryName} › {t.subCategoryName}
            </span>
          </div>
        ),
      },
      {
        label: "Decision",
        value: <DecisionBadge decision={t.decision} />,
      },
    ],
    [],
  );

  const secondaryFields = useCallback(
    (t: ReviewerDecidedItemResponse): CardField[] => [
      {
        label: "Period",
        value: `${t.year} ${periodLabels[t.period] || t.period}`,
      },
      { label: "Assigned To", value: t.assignedTo.join(", ") },
      { label: "Decided", value: formatDate(t.decidedAt) },
    ],
    [],
  );

  const handleItemClick = useCallback(
    (t: ReviewerDecidedItemResponse) => onRowClick(t.id),
    [onRowClick],
  );

  return (
    <div className="bg-white rounded-lg custom-shadow border border-gray-200 border-l-[3px] border-l-emerald-400 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center text-sm gap-3 font-medium px-4 py-3.5 transition-colors hover:bg-gray-50"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-emerald-50 text-emerald-600">
          <CheckCheck className="w-4 h-4" />
        </span>
        <span className="text-primary">Recently Decided</span>
        {tasks.length > 0 ? (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
            {tasks.length}
          </span>
        ) : (
          <span className="text-xs text-gray-400">(0)</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ResponsiveTable
          data={tasks}
          keyExtractor={keyExtractor}
          primaryFields={primaryFields}
          secondaryFields={secondaryFields}
          onItemClick={handleItemClick}
          emptyMessage="No recently decided tasks."
        >
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="th-label w-[20%]">Client Name</th>
                <th className="th-label w-[26%]">Task</th>
                <th className="th-label w-[8%]">Period</th>
                <th className="th-label w-[12%]">Decision</th>
                <th className="th-label w-[18%]">Assigned To</th>
                <th className="th-label w-[16%]">Decided</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => onRowClick(task.id)}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3.5 max-w-0">
                    <span className="block truncate text-sm font-medium text-gray-800" title={task.clientName}>
                      {task.clientName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 max-w-0">
                    <span className="block truncate text-sm font-medium text-primary" title={task.taskName}>
                      {task.taskName}
                    </span>
                    <span className="block truncate text-xs text-gray-400 mt-0.5" title={`${task.categoryName} › ${task.subCategoryName}`}>
                      {task.categoryName} › {task.subCategoryName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="block text-sm text-gray-700">{task.year}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">
                      {periodLabels[task.period] || task.period}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <DecisionBadge decision={task.decision} />
                  </td>
                  <td className="px-4 py-3.5 max-w-0">
                    <span className="block truncate text-sm text-gray-600" title={task.assignedTo.join(", ")}>
                      {task.assignedTo.join(", ")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-400 whitespace-nowrap">
                    {formatDate(task.decidedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTable>
      )}
    </div>
  );
}
