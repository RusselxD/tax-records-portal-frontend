import type { TaxRecordTaskRejectedItemResponse } from "../../../../../../../types/tax-record-task";
import { formatDate } from "../../../../../../../lib/formatters";
import InlineBanner from "./InlineBanner";
import { periodLabels } from "../../../../../../../constants/tax-record-task";

export default function RejectedTable({
  tasks,
  onRowClick,
}: {
  tasks: TaxRecordTaskRejectedItemResponse[];
  onRowClick: (id: string) => void;
}) {
  return (
    <div className="mt-4">
      <InlineBanner label={`You have ${tasks.length} rejected tasks.`} />
      <div className="mt-4 bg-white rounded-lg custom-shadow overflow-hidden border-l-4 border-red-600">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="th-label w-[22%]">Client Name</th>
              <th className="th-label w-[34%]">Task</th>
              <th className="th-label w-[8%]">Period</th>
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
                <td
                  className={`px-4 py-3.5 text-sm whitespace-nowrap ${task.isOverdue ? "font-medium text-red-500" : "text-gray-600"}`}
                >
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
