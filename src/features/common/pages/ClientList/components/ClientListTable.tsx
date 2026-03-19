import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "../../../../../lib/formatters";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../constants/permissions";
import ClientStatusBadge from "../../../../../components/common/ClientStatusBadge";
import { useClientList } from "../context/ClientListContext";
import type { ClientListItemResponse } from "../../../../../types/client";
import { getRolePrefix } from "../../../../../constants";

const HEADERS: {
  label: string;
  className: string;
  showWhen?: "accountant" | "viewAll";
}[] = [
  { label: "Client Name", className: "w-[22%] min-w-[180px]" },
  { label: "Accountants", className: "w-[18%] min-w-[150px]", showWhen: "viewAll" },
  { label: "Total Tasks", className: "w-[10%] min-w-[90px]" },
  { label: "Pending", className: "w-[10%] min-w-[90px]" },
  { label: "Overdue", className: "w-[10%] min-w-[90px]" },
  { label: "Nearest Deadline", className: "w-[14%] min-w-[120px]", showWhen: "accountant" },
  { label: "Status", className: "w-[12%] min-w-[110px]" },
];

function ClientRow({
  client,
  canViewAll,
}: {
  client: ClientListItemResponse;
  canViewAll: boolean;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefix = getRolePrefix(user!.roleKey);

  return (
    <tr
      onClick={() => navigate(`${prefix}/client-details/${client.id}`)}
      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
    >
      <td className="px-4 py-4 text-sm font-medium text-primary max-w-0">
        <span className="block truncate" title={client.clientName}>
          {client.clientName}
        </span>
      </td>
      {canViewAll && (
        <td className="px-4 py-4 text-sm text-gray-600 max-w-0">
          <span className="block truncate" title={client.accountants.join(", ")}>
            {client.accountants.join(", ") || "—"}
          </span>
        </td>
      )}
      <td className="px-4 py-4 text-sm text-gray-600">
        {client.totalTasks}
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">
        {client.pendingTasks}
      </td>
      <td className="px-4 py-4 text-sm">
        <span className={client.overdueTasks > 0 ? "text-red-600 font-medium" : "text-gray-600"}>
          {client.overdueTasks}
        </span>
      </td>
      {!canViewAll && (
        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
          {client.nearestDeadline ? formatDate(client.nearestDeadline) : "—"}
        </td>
      )}
      <td className="px-4 py-4 whitespace-nowrap">
        <ClientStatusBadge status={client.status} />
      </td>
    </tr>
  );
}

function Pagination() {
  const { page, totalPages, totalElements, setPage } = useClientList();

  if (totalPages <= 1) return null;

  const start = page * 20 + 1;
  const end = Math.min((page + 1) * 20, totalElements);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Showing {start}–{end} of {totalElements}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {generatePageNumbers(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p as number)}
              className={`min-w-[32px] h-8 rounded-md text-sm font-medium transition-colors ${
                p === page
                  ? "bg-accent text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {(p as number) + 1}
            </button>
          ),
        )}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function generatePageNumbers(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const pages: (number | "...")[] = [0];
  if (current > 2) pages.push("...");

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) pages.push("...");
  pages.push(total - 1);

  return pages;
}

export default function ClientListTable() {
  const { clients, isFetching, error, refetch } = useClientList();
  const { user } = useAuth();
  const canViewAll = hasPermission(user?.permissions, Permission.CLIENT_VIEW_ALL);

  const visibleHeaders = HEADERS.filter(
    (h) =>
      !h.showWhen ||
      (h.showWhen === "viewAll" && canViewAll) ||
      (h.showWhen === "accountant" && !canViewAll),
  );

  if (error) {
    return (
      <div className="rounded-lg bg-white custom-shadow p-8 text-center">
        <p className="text-sm text-status-rejected mb-3">{error}</p>
        <button
          onClick={refetch}
          className="text-sm text-accent hover:text-accent-hover font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white custom-shadow">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-gray-200">
            {visibleHeaders.map((header) => (
              <th
                key={header.label}
                className={`th-label ${header.className}`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        {isFetching ? (
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                {Array.from({ length: visibleHeaders.length }).map((_, j) => (
                  <td key={j} className="px-4 py-4">
                    <div className="h-4 w-24 rounded skeleton" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : clients.length === 0 ? (
          <tbody>
            <tr>
              <td
                colSpan={visibleHeaders.length}
                className="px-4 py-12 text-center text-sm text-gray-500"
              >
                No clients found.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {clients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                canViewAll={canViewAll}
              />
            ))}
          </tbody>
        )}
      </table>
      <Pagination />
    </div>
  );
}
