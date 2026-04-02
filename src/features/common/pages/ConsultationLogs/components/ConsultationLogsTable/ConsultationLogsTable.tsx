import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../../constants/permissions";
import { getRolePrefix } from "../../../../../../constants/roles";
import { Pagination, ResponsiveTable } from "../../../../../../components/common";
import type { CardField } from "../../../../../../components/common/ResponsiveTable";
import Dropdown from "../../../../../../components/common/Dropdown";
import { clientAPI } from "../../../../../../api/client";
import { formatDate } from "../../../../../../lib/formatters";
import {
  statusLabels,
  statusStyles,
  billableLabels,
  billableStyles,
} from "../../../../../../constants/consultation";
import type { ConsultationLogListItem } from "../../../../../../types/consultation";
import { useConsultationLogs } from "../../context/ConsultationLogsContext";
import LogRow from "./components/LogRow";

const statusOptions = [
  { label: "All Statuses", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const billableOptions = [
  { label: "All Types", value: "" },
  { label: "Included", value: "INCLUDED" },
  { label: "Excess", value: "EXCESS" },
  { label: "Courtesy", value: "COURTESY" },
];

const TableSkeleton = ({ colCount }: { colCount: number }) => (
  <tbody>
    {Array.from({ length: 8 }).map((_, i) => (
      <tr key={i} className="border-b border-gray-100">
        {Array.from({ length: colCount }).map((_, j) => (
          <td key={j} className="px-4 py-4">
            <div className="h-4 w-24 rounded skeleton" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const EmptyState = ({ colCount }: { colCount: number }) => (
  <tbody>
    <tr>
      <td colSpan={colCount} className="px-4 py-12 text-center text-sm text-gray-500">
        No consultation logs found.
      </td>
    </tr>
  </tbody>
);

export default function ConsultationLogsTable() {
  const { logs, isFetching, error, refetch, page, totalPages, totalElements, setPage, filters, setClientFilter, setStatusFilter, setBillableFilter } = useConsultationLogs();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canViewAll = hasPermission(user?.permissions, Permission.CONSULTATION_VIEW_ALL);
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const [clientOptions, setClientOptions] = useState<{ label: string; value: string }[]>([
    { label: "All Clients", value: "" },
  ]);

  useEffect(() => {
    clientAPI.getActiveClients().then((data) => {
      setClientOptions([
        { label: "All Clients", value: "" },
        ...data.map((c) => ({ label: c.displayName, value: c.id })),
      ]);
    }).catch(() => {});
  }, []);

  const colCount = canViewAll ? 7 : 6;

  const keyExtractor = useCallback((log: ConsultationLogListItem) => log.id, []);

  const primaryFields = useCallback(
    (log: ConsultationLogListItem): CardField[] => [
      { label: "Client", value: log.clientDisplayName, stacked: true },
      { label: "Date", value: formatDate(log.date) },
      {
        label: "Status",
        value: (
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[log.status]}`}>
            {statusLabels[log.status]}
          </span>
        ),
      },
    ],
    []
  );

  const secondaryFields = useCallback(
    (log: ConsultationLogListItem): CardField[] => {
      const fields: CardField[] = [
        { label: "Hours", value: `${log.hours.toFixed(2)}h` },
        { label: "Subject", value: log.subject },
        {
          label: "Type",
          value: (
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${billableStyles[log.billableType]}`}>
              {billableLabels[log.billableType]}
            </span>
          ),
        },
      ];
      if (canViewAll) {
        fields.push({ label: "Created By", value: log.createdByName });
      }
      return fields;
    },
    [canViewAll]
  );

  const handleItemClick = useCallback(
    (log: ConsultationLogListItem) => {
      navigate(`/${prefix}/consultation-logs/${log.id}`);
    },
    [navigate, prefix]
  );

  if (error) {
    return (
      <div className="rounded-lg bg-white custom-shadow p-8 text-center">
        <p className="text-sm text-status-rejected mb-3">{error}</p>
        <button onClick={refetch} className="text-sm text-accent hover:text-accent-hover font-medium">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white custom-shadow">
      <ResponsiveTable
        data={logs}
        keyExtractor={keyExtractor}
        primaryFields={primaryFields}
        secondaryFields={secondaryFields}
        onItemClick={handleItemClick}
        isLoading={isFetching}
        emptyMessage="No consultation logs found."
        mobileFilters={
          <>
            <Dropdown
              options={clientOptions}
              value={filters.clientId || ""}
              onChange={setClientFilter}
              placeholder="Client"
              className="flex-1 min-w-0"
            />
            <Dropdown
              options={billableOptions}
              value={(filters.billableType as string) || ""}
              onChange={setBillableFilter}
              placeholder="Type"
              className="flex-1 min-w-0"
            />
            <Dropdown
              options={statusOptions}
              value={(filters.status as string) || ""}
              onChange={setStatusFilter}
              placeholder="Status"
              className="flex-1 min-w-0"
            />
          </>
        }
      >
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="th-label w-[18%]">
                <Dropdown
                  headerStyle
                  portal
                  options={clientOptions}
                  value={filters.clientId || ""}
                  onChange={setClientFilter}
                  placeholder="Client"
                />
              </th>
              <th className="th-label w-[12%]">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Date</span>
              </th>
              <th className="th-label w-[8%]">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hours</span>
              </th>
              <th className="th-label w-[25%]">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Subject</span>
              </th>
              <th className="th-label w-[10%]">
                <Dropdown
                  headerStyle
                  portal
                  options={billableOptions}
                  value={(filters.billableType as string) || ""}
                  onChange={setBillableFilter}
                  placeholder="Type"
                />
              </th>
              <th className="th-label w-[10%]">
                <Dropdown
                  headerStyle
                  portal
                  options={statusOptions}
                  value={(filters.status as string) || ""}
                  onChange={setStatusFilter}
                  placeholder="Status"
                />
              </th>
              {canViewAll && (
                <th className="th-label w-[12%]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Created By</span>
                </th>
              )}
            </tr>
          </thead>
          {isFetching ? (
            <TableSkeleton colCount={colCount} />
          ) : logs.length === 0 ? (
            <EmptyState colCount={colCount} />
          ) : (
            <tbody>
              {logs.map((log) => (
                <LogRow
                  key={log.id}
                  log={log}
                  showCreatedBy={canViewAll}
                  onClick={() => navigate(`/${prefix}/consultation-logs/${log.id}`)}
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
        pageSize={20}
        onPageChange={setPage}
      />
    </div>
  );
}
