import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { useAuth } from "../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../constants";
import { getRolePrefix } from "../../../../constants/roles";
import { Pagination, ResponsiveTable } from "../../../../components/common";
import type { CardField } from "../../../../components/common/ResponsiveTable";
import { taxRecordTaskRequestAPI } from "../../../../api/tax-record-task-request";
import { getErrorMessage } from "../../../../lib/api-error";
import { formatDate } from "../../../../lib/formatters";
import { periodLabels } from "../../../../constants/tax-record-task";
import {
  requestStatusLabels,
  requestStatusStyles,
  requestStatusDotColors,
} from "../../../../constants/tax-record-task-request";
import {
  TAX_RECORD_TASK_REQUEST_STATUS,
  type TaxRecordTaskRequestListItem,
  type TaxRecordTaskRequestStatus,
} from "../../../../types/tax-record-task-request";
import RequestRow from "./components/RequestRow";
import RequestTaskModal from "./components/RequestTaskModal";

const PAGE_SIZE = 20;

const TABS: { label: string; value: TaxRecordTaskRequestStatus }[] = [
  { label: "Pending", value: TAX_RECORD_TASK_REQUEST_STATUS.PENDING },
  { label: "Approved", value: TAX_RECORD_TASK_REQUEST_STATUS.APPROVED },
  { label: "Rejected", value: TAX_RECORD_TASK_REQUEST_STATUS.REJECTED },
];

export default function TaxRecordTaskRequests() {
  usePageTitle("Task Requests");
  const { user } = useAuth();
  const navigate = useNavigate();
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const canReview = hasPermission(user?.permissions, Permission.TAX_RECORD_TASK_REQUEST_REVIEW);
  const canRequest = hasPermission(user?.permissions, Permission.TAX_RECORD_TASK_REQUEST_CREATE);

  const [tab, setTab] = useState<TaxRecordTaskRequestStatus>(TAX_RECORD_TASK_REQUEST_STATUS.PENDING);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<TaxRecordTaskRequestListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const fetchPage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await taxRecordTaskRequestAPI.list({
        page,
        size: PAGE_SIZE,
        status: tab,
      });
      setItems(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load task requests."));
    } finally {
      setIsLoading(false);
    }
  }, [page, tab]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  useEffect(() => {
    setPage(0);
  }, [tab]);

  const handleRowClick = useCallback(
    (item: TaxRecordTaskRequestListItem) => {
      navigate(`${prefix}/task-requests/${item.id}`);
    },
    [navigate, prefix],
  );

  const keyExtractor = useCallback((item: TaxRecordTaskRequestListItem) => item.id, []);

  const primaryFields = useCallback(
    (item: TaxRecordTaskRequestListItem): CardField[] => [
      { label: "Client", value: item.clientDisplayName, stacked: true },
      { label: "Task", value: item.taskName, stacked: true },
      {
        label: "Status",
        value: (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${requestStatusStyles[item.status]}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${requestStatusDotColors[item.status]}`} />
            {requestStatusLabels[item.status]}
          </span>
        ),
      },
    ],
    [],
  );

  const secondaryFields = useCallback(
    (item: TaxRecordTaskRequestListItem): CardField[] => {
      const fields: CardField[] = [
        {
          label: "Year / Period",
          value: `${item.year} · ${periodLabels[item.period] ?? item.period}`,
        },
        { label: "Category", value: `${item.categoryName} · ${item.subCategoryName}` },
        { label: "Submitted", value: formatDate(item.submittedAt) },
      ];
      if (canReview) {
        fields.push({ label: "Requester", value: item.requester.name });
      }
      return fields;
    },
    [canReview],
  );

  const colCount = canReview ? 6 : 5;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 bg-white py-2 px-3 rounded-lg">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                tab === t.value
                  ? "bg-accent text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {canRequest && (
          <button
            onClick={() => setRequestModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Request</span>
            <span className="sm:hidden">New</span>
          </button>
        )}
      </div>

      {error ? (
        <div className="rounded-lg bg-white custom-shadow p-8 text-center">
          <p className="text-sm text-status-rejected mb-3">{error}</p>
          <button
            onClick={fetchPage}
            className="text-sm text-accent hover:text-accent-hover font-medium"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="rounded-lg bg-white custom-shadow">
          <ResponsiveTable
            data={items}
            keyExtractor={keyExtractor}
            primaryFields={primaryFields}
            secondaryFields={secondaryFields}
            onItemClick={handleRowClick}
            isLoading={isLoading}
            emptyMessage={`No ${requestStatusLabels[tab].toLowerCase()} task requests.`}
          >
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th-label w-[20%]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Client
                    </span>
                  </th>
                  <th className="th-label w-[28%]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Task
                    </span>
                  </th>
                  <th className="th-label w-[12%]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Year / Period
                    </span>
                  </th>
                  <th className="th-label w-[12%]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </span>
                  </th>
                  {canReview && (
                    <th className="th-label w-[14%]">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Requester
                      </span>
                    </th>
                  )}
                  <th className="th-label w-[14%]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Submitted
                    </span>
                  </th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {Array.from({ length: colCount }).map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 w-24 rounded skeleton" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ) : items.length === 0 ? (
                <tbody>
                  <tr>
                    <td
                      colSpan={colCount}
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      No {requestStatusLabels[tab].toLowerCase()} task requests.
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {items.map((item) => (
                    <RequestRow
                      key={item.id}
                      item={item}
                      showRequester={canReview}
                      onClick={() => handleRowClick(item)}
                    />
                  ))}
                </tbody>
              )}
            </table>
          </ResponsiveTable>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}

      {requestModalOpen && (
        <RequestTaskModal
          setModalOpen={setRequestModalOpen}
          onSuccess={fetchPage}
        />
      )}
    </div>
  );
}
