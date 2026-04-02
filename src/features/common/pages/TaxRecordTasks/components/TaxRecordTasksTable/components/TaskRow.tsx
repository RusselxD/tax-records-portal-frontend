import { formatDate } from "../../../../../../../lib/formatters";
import { TAX_RECORD_TASK_STATUS, type TaxRecordTaskListItem, type TaxRecordTaskStatus } from "../../../../../../../types/tax-record-task";
import {
  statusStyles,
  statusDotColors,
  statusLabels,
  rowBgColors,
  periodLabels,
} from "../../../../../../../constants/tax-record-task";

function StatusBadge({ status }: { status: TaxRecordTaskStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium flex-shrink-0 whitespace-nowrap ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotColors[status]}`} />
      {statusLabels[status]}
    </span>
  );
}

export default function TaskRow({
  task,
  showAssignedTo,
  showCreated,
  onClick,
}: {
  task: TaxRecordTaskListItem;
  showAssignedTo: boolean;
  showCreated: boolean;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50/80 cursor-pointer ${rowBgColors[task.status]}`}
    >
      <td className={`px-4 py-3.5 text-sm font-medium text-primary max-w-0 ${task.isOverdue || task.status === TAX_RECORD_TASK_STATUS.REJECTED ? "border-l-4 border-l-red-400" : ""}`}>
        <span className="block truncate" title={task.clientDisplayName}>
          {task.clientDisplayName}
        </span>
      </td>
      <td className="px-4 py-3.5 max-w-0">
        <span className="block truncate text-sm text-gray-700" title={task.taskName}>
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
        <StatusBadge status={task.status} />
      </td>
      <td className={`px-4 py-3.5 text-sm whitespace-nowrap ${task.isOverdue ? "text-red-500 font-medium" : "text-gray-600"}`}>
        {formatDate(task.deadline)}
      </td>
      {showAssignedTo && (
        <td className="px-4 py-3.5 text-sm text-gray-600 max-w-0 hidden xl:table-cell">
          <span className="block truncate" title={task.assignedTo.join(", ")}>
            {task.assignedTo.join(", ")}
          </span>
        </td>
      )}
      {showCreated && (
        <td className="px-4 py-3.5 max-w-0 hidden xl:table-cell">
          <span className="block truncate text-sm text-gray-600" title={task.createdBy}>
            {task.createdBy}
          </span>
          <span className="block text-xs text-gray-400 mt-0.5">
            {formatDate(task.createdAt)}
          </span>
        </td>
      )}
    </tr>
  );
}
