import { formatDate } from "../../../../../lib/formatters";
import { periodLabels } from "../../../../../constants/tax-record-task";
import {
  requestStatusLabels,
  requestStatusStyles,
  requestStatusDotColors,
} from "../../../../../constants/tax-record-task-request";
import type { TaxRecordTaskRequestListItem } from "../../../../../types/tax-record-task-request";

interface Props {
  item: TaxRecordTaskRequestListItem;
  showRequester: boolean;
  onClick: () => void;
}

export default function RequestRow({ item, showRequester, onClick }: Props) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50/80 cursor-pointer"
    >
      <td className="px-4 py-3.5 text-sm font-medium text-primary max-w-0">
        <span className="block truncate" title={item.clientDisplayName}>
          {item.clientDisplayName}
        </span>
      </td>
      <td className="px-4 py-3.5 max-w-0">
        <span className="block truncate text-sm font-medium text-primary" title={item.taskName}>
          {item.taskName}
        </span>
        <span className="block truncate text-xs text-gray-400 mt-0.5">
          {item.categoryName} &middot; {item.subCategoryName}
        </span>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
        {item.year} &middot; {periodLabels[item.period] ?? item.period}
      </td>
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${requestStatusStyles[item.status]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${requestStatusDotColors[item.status]}`} />
          {requestStatusLabels[item.status]}
        </span>
      </td>
      {showRequester && (
        <td className="px-4 py-3.5 max-w-0">
          <span className="block truncate text-sm text-gray-600" title={item.requester.name}>
            {item.requester.name}
          </span>
        </td>
      )}
      <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
        {formatDate(item.submittedAt)}
      </td>
    </tr>
  );
}
