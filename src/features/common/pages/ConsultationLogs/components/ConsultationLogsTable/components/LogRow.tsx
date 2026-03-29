import { formatDate } from "../../../../../../../lib/formatters";
import type { ConsultationLogListItem } from "../../../../../../../types/consultation";
import {
  statusLabels,
  statusStyles,
  billableLabels,
  billableStyles,
} from "../../../../../../../constants/consultation";

export default function LogRow({
  log,
  showCreatedBy,
  onClick,
}: {
  log: ConsultationLogListItem;
  showCreatedBy: boolean;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50/80 cursor-pointer"
    >
      <td className="px-4 py-3.5 text-sm font-medium text-primary max-w-0">
        <span className="block truncate" title={log.clientDisplayName}>
          {log.clientDisplayName}
        </span>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
        {formatDate(log.date)}
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
        {log.startTime} – {log.endTime}
      </td>
      <td className="px-4 py-3.5 text-sm font-medium text-primary whitespace-nowrap">
        {log.hours.toFixed(2)}h
      </td>
      <td className="px-4 py-3.5 max-w-0">
        <span className="block truncate text-sm text-gray-700" title={log.subject}>
          {log.subject}
        </span>
        <span className="block truncate text-xs text-gray-400 mt-0.5">
          {log.platform}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${billableStyles[log.billableType]}`}>
          {billableLabels[log.billableType]}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[log.status]}`}>
          {statusLabels[log.status]}
        </span>
      </td>
      {showCreatedBy && (
        <td className="px-4 py-3.5 max-w-0">
          <span className="block truncate text-sm text-gray-600" title={log.createdByName}>
            {log.createdByName}
          </span>
          <span className="block text-xs text-gray-400 mt-0.5">
            {formatDate(log.createdAt)}
          </span>
        </td>
      )}
    </tr>
  );
}
