import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import type { ParsedRow } from "../../../hooks/useImportTaxRecordTasks";

interface PreviewTableProps {
  rows: ParsedRow[];
  validCount: number;
  invalidCount: number;
}

const PREVIEW_HEADERS = [
  "#",
  "Client Name",
  "Category",
  "Sub Category",
  "Task Name",
  "Year",
  "Period",
  "Deadline",
  "Assigned To",
  "Status",
];

export default function PreviewTable({
  rows,
  validCount,
  invalidCount,
}: PreviewTableProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-primary">3. Review</h3>

      {/* Summary */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">
          {rows.length} {rows.length === 1 ? "row" : "rows"} found
        </span>
        {validCount > 0 && (
          <span className="inline-flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {validCount} valid
          </span>
        )}
        {invalidCount > 0 && (
          <span className="inline-flex items-center gap-1 text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            {invalidCount} invalid
          </span>
        )}
      </div>

      {/* Table */}
      <div className="max-h-80 overflow-auto rounded-md border border-gray-200">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              {PREVIEW_HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.row}
                className={`border-t border-gray-100 ${
                  !row.isValid ? "bg-red-50/50" : ""
                }`}
              >
                <td className="px-3 py-2 text-gray-400 whitespace-nowrap text-xs">
                  {row.row}
                </td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {row.clientName || "\u2014"}
                </td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {row.category || "\u2014"}
                </td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {row.subCategory || "\u2014"}
                </td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {row.taskName || "\u2014"}
                </td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {row.year || "\u2014"}
                </td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {row.period || "\u2014"}
                </td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {row.deadline || "\u2014"}
                </td>
                <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {row.assignedTo || "\u2014"}
                </td>
                <td className="px-3 py-2">
                  <RowStatusIcon row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error details */}
      {invalidCount > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50/50">
          <div className="flex items-center gap-2 border-b border-red-200 px-4 py-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-sm font-medium text-red-700">
              {invalidCount} row{invalidCount !== 1 ? "s" : ""} with errors
            </span>
          </div>
          <ul className="divide-y divide-red-100 max-h-40 overflow-auto">
            {rows
              .filter((r) => !r.isValid)
              .map((row) => (
                <li key={row.row} className="flex gap-3 px-4 py-2 text-sm">
                  <span className="text-red-400 shrink-0 font-medium">
                    Row {row.row}
                  </span>
                  <span className="text-red-600">{row.errors.join(" ")}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function RowStatusIcon({ row }: { row: ParsedRow }) {
  if (!row.isValid) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
        <AlertCircle className="w-3.5 h-3.5" />
        Error
      </span>
    );
  }

  if (row.warnings.length > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
        <AlertTriangle className="w-3.5 h-3.5" />
        Warning
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Valid
    </span>
  );
}
