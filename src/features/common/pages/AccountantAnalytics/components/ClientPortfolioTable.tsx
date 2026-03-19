import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { accountantAnalyticsAPI } from "../../../../../api/accountantAnalytics";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants/roles";
import { formatDate } from "../../../../../lib/formatters";
import ClientStatusBadge from "../../../../../components/common/ClientStatusBadge";
import type { ClientPortfolioItem, ClientPortfolioResponse } from "../../../../../types/analytics";
import type { ClientStatus } from "../../../../../types/client";

const PAGE_SIZE = 20;

const TableSkeleton = () => (
  <tr>
    <td colSpan={6} className="p-4">
      <div className="skeleton h-40 rounded-lg" />
    </td>
  </tr>
);

const EmptyRow = () => (
  <tr>
    <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
      No clients in your portfolio yet.
    </td>
  </tr>
);

const TableRow = ({
  item,
  clientPath,
}: {
  item: ClientPortfolioItem;
  clientPath: string;
}) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <td className="py-3 px-4">
      <Link
        to={clientPath}
        className="text-sm font-medium text-primary hover:underline"
      >
        {item.clientName}
      </Link>
    </td>
    <td className="py-3 px-4">
      <ClientStatusBadge status={item.status as ClientStatus} />
    </td>
    <td className="py-3 px-4 text-sm text-gray-700 tabular-nums">
      {item.totalTasks.toLocaleString()}
    </td>
    <td className="py-3 px-4 text-sm text-gray-700 tabular-nums">
      {item.pendingTasks.toLocaleString()}
    </td>
    <td className="py-3 px-4">
      <span
        className={`text-sm tabular-nums font-medium ${
          item.overdueTasks > 0 ? "text-status-rejected" : "text-gray-700"
        }`}
      >
        {item.overdueTasks.toLocaleString()}
      </span>
    </td>
    <td className="py-3 px-4 text-sm text-gray-500">
      {item.nearestDeadline ? formatDate(item.nearestDeadline) : "—"}
    </td>
  </tr>
);

export default function ClientPortfolioTable() {
  const { user } = useAuth();
  const [result, setResult] = useState<ClientPortfolioResponse | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rolePrefix = getRolePrefix(user!.roleKey);

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountantAnalyticsAPI.getClientPortfolio(p, PAGE_SIZE);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load client portfolio."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const totalPages = result?.totalPages ?? 1;
  const totalElements = result?.totalElements ?? 0;

  return (
    <div className="rounded-lg bg-white custom-shadow overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-primary">Client Portfolio</h2>
        {result && (
          <span className="text-sm text-gray-400">
            {totalElements.toLocaleString()}{" "}
            {totalElements === 1 ? "client" : "clients"}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-center py-10 text-sm text-status-rejected">
          <span>{error}</span>
          <button
            onClick={() => fetchPage(page)}
            className="ml-2 underline hover:no-underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {!error && (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Client", "Status", "Total Tasks", "Pending", "Overdue", "Nearest Deadline"].map(
                (h) => (
                  <th
                    key={h}
                    className="py-2.5 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton />}
            {!loading && result?.content.length === 0 && <EmptyRow />}
            {!loading &&
              result?.content.map((item) => (
                <TableRow
                  key={item.clientId}
                  item={item}
                  clientPath={`/${rolePrefix}/client-details/${item.clientId}`}
                />
              ))}
          </tbody>
        </table>
      )}

      {!error && !loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
          <span className="text-sm text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
