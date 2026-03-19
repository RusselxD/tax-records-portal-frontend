import type { TaxRecordTaskOverdueItemResponse } from "../../../../../../../types/tax-record-task";
import { formatDate } from "../../../../../../../lib/formatters";
import InlineBanner from "./InlineBanner";
import {
  statusLabels,
  statusStyles,
  periodLabels,
} from "../../../../../../../constants/tax-record-task";

export default function OverdueTable({
  tasks,
  onRowClick,
}: {
  tasks: TaxRecordTaskOverdueItemResponse[];
  onRowClick: (id: string) => void;
}) {
  return (
    <div>
      <InlineBanner label={`You have ${tasks.length} overdue tasks.`} />
      <div className="mt-4 bg-white rounded-lg custom-shadow overflow-hidden border-l-4 border-red-600">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="th-label w-[20%]">Client Name</th>
              <th className="th-label w-[28%]">Task</th>
              <th className="th-label w-[8%]">Period</th>
              <th className="th-label w-[14%]">Status</th>
              <th className="th-label w-[12%]">Deadline</th>
              <th className="th-label w-[18%]">Created</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onRowClick(task.id)}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3.5 max-w-0">
                  <span
                    className="block truncate text-sm font-medium text-gray-800"
                    title={task.clientName}
                  >
                    {task.clientName}
                  </span>
                </td>
                <td className="px-4 py-3.5 max-w-0">
                  <span
                    className="block truncate text-sm font-medium text-primary"
                    title={task.taskName}
                  >
                    {task.taskName}
                  </span>
                  <span
                    className="block truncate text-xs text-gray-400 mt-0.5"
                    title={`${task.categoryName} › ${task.subCategoryName}`}
                  >
                    {task.categoryName} › {task.subCategoryName}
                  </span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="block text-sm text-gray-700">
                    {task.year}
                  </span>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {periodLabels[task.period] || task.period}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${statusStyles[task.status]}`}
                  >
                    {statusLabels[task.status]}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm font-medium text-red-500 whitespace-nowrap">
                  {formatDate(task.deadline)}
                </td>
                <td className="px-4 py-3.5 max-w-0">
                  <span
                    className="block truncate text-sm text-gray-600"
                    title={task.createdBy}
                  >
                    {task.createdBy}
                  </span>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {formatDate(task.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
