import { useCallback, useState } from "react";
import type { ReviewerQueueItemResponse } from "../../../../../../../types/tax-record-task";
import { formatDate } from "../../../../../../../lib/formatters";
import { periodLabels } from "../../../../../../../constants/tax-record-task";
import { ResponsiveTable } from "../../../../../../../components/common";
import type { CardField } from "../../../../../../../components/common/ResponsiveTable";
import { ChevronDown, ClipboardList } from "lucide-react";

export default function QueueTable({
  tasks,
  onRowClick,
}: {
  tasks: ReviewerQueueItemResponse[];
  onRowClick: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const keyExtractor = useCallback((t: ReviewerQueueItemResponse) => t.id, []);

  const primaryFields = useCallback(
    (t: ReviewerQueueItemResponse): CardField[] => [
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
        label: "Period",
        value: `${t.year} ${periodLabels[t.period] || t.period}`,
      },
    ],
    [],
  );

  const secondaryFields = useCallback(
    (t: ReviewerQueueItemResponse): CardField[] => [
      {
        label: "Deadline",
        value: (
          <span className={t.isOverdue ? "font-medium text-red-500" : ""}>
            {formatDate(t.deadline)}
          </span>
        ),
      },
      { label: "Assigned To", value: t.assignedTo.join(", ") },
      { label: "Submitted", value: formatDate(t.submittedAt) },
    ],
    [],
  );

  const handleItemClick = useCallback(
    (t: ReviewerQueueItemResponse) => onRowClick(t.id),
    [onRowClick],
  );

  const cardClassName = useCallback(
    (t: ReviewerQueueItemResponse) => (t.isOverdue ? "border-l-4 border-l-red-400" : ""),
    [],
  );

  return (
    <div className="bg-white rounded-lg custom-shadow border border-gray-200 border-l-[3px] border-l-amber-400 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center text-sm gap-3 font-medium px-4 py-3.5 transition-colors hover:bg-gray-50"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-amber-50 text-amber-600">
          <ClipboardList className="w-4 h-4" />
        </span>
        <span className="text-primary">Awaiting Review</span>
        {tasks.length > 0 ? (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
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
          cardClassName={cardClassName}
          emptyMessage="No tasks awaiting review."
        >
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="th-label w-[20%]">Client Name</th>
                <th className="th-label w-[28%]">Task</th>
                <th className="th-label w-[8%]">Period</th>
                <th className="th-label w-[14%]">Deadline</th>
                <th className="th-label w-[18%]">Assigned To</th>
                <th className="th-label w-[12%]">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                    No tasks awaiting review.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => onRowClick(task.id)}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 cursor-pointer transition-colors"
                  >
                    <td className={`px-4 py-3.5 max-w-0 ${task.isOverdue ? "border-l-4 border-l-red-400" : ""}`}>
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
                    <td className={`px-4 py-3.5 text-sm whitespace-nowrap ${task.isOverdue ? "font-medium text-red-500" : "text-gray-600"}`}>
                      {formatDate(task.deadline)}
                    </td>
                    <td className="px-4 py-3.5 max-w-0">
                      <span className="block truncate text-sm text-gray-600" title={task.assignedTo.join(", ")}>
                        {task.assignedTo.join(", ")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-400 whitespace-nowrap">
                      {formatDate(task.submittedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ResponsiveTable>
      )}
    </div>
  );
}
