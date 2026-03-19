import type { ReviewerQueueItemResponse } from "../../../../../../../types/tax-record-task";
import { formatDate } from "../../../../../../../lib/formatters";
import { periodLabels } from "../../../../../../../constants/tax-record-task";
import { ClipboardList } from "lucide-react";

export default function QueueTable({
  tasks,
  onRowClick,
}: {
  tasks: ReviewerQueueItemResponse[];
  onRowClick: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 font-semibold bg-white border border-b-0 border-gray-200 rounded-t-lg px-4 py-3 custom-shadow w-1/2">
        <ClipboardList className="w-5 h-5 text-primary" />
        <span>Awaiting Review</span>
        <span className="text-gray-400">({tasks.length})</span>
      </div>
      <div className="bg-white rounded-tr-lg rounded-b-lg border border-gray-200 custom-shadow overflow-hidden">
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
      </div>
    </div>
  );
}
