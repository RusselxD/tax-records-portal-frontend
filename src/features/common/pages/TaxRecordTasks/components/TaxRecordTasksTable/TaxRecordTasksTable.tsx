import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../../constants/permissions";
import { getRolePrefix } from "../../../../../../constants/roles";
import { Pagination } from "../../../../../../components/common";
import Dropdown from "../../../../../../components/common/Dropdown";
import { useTaxRecordTasks } from "../../context/TaxRecordTasksContext";
import { usersAPI } from "../../../../../../api/users";
import { clientAPI } from "../../../../../../api/client";
import { taxRecordTaskAPI } from "../../../../../../api/tax-record-task";
import TaskRow from "./components/TaskRow";

interface HeaderDef {
  label: string;
  className: string;
  showWhen?: "canViewAllOrReview" | "notReviewOnly";
  filter?: "client" | "taskName" | "status" | "period" | "accountant";
}

const HEADERS: HeaderDef[] = [
  { label: "Client Name", className: "w-[18%] min-w-[160px]", filter: "client" },
  { label: "Task", className: "w-[25%] min-w-[220px]", filter: "taskName" },
  { label: "Period", className: "w-[7%] min-w-[80px]", filter: "period" },
  { label: "Status", className: "w-[14%] min-w-[150px]", filter: "status" },
  { label: "Deadline", className: "w-[10%] min-w-[100px]" },
  { label: "Assigned To", className: "w-[12%] min-w-[120px]", showWhen: "canViewAllOrReview", filter: "accountant" },
  { label: "Created", className: "w-[14%] min-w-[150px]", showWhen: "notReviewOnly" },
];

const statusOptions = [
  { label: "All Statuses", value: "" },
  { label: "Open", value: "OPEN" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Approved for Filing", value: "APPROVED_FOR_FILING" },
  { label: "Filed", value: "FILED" },
  { label: "Completed", value: "COMPLETED" },
];

const periodOptions = [
  { label: "All Periods", value: "" },
  { label: "January", value: "JAN" },
  { label: "February", value: "FEB" },
  { label: "March", value: "MAR" },
  { label: "April", value: "APR" },
  { label: "May", value: "MAY" },
  { label: "June", value: "JUN" },
  { label: "July", value: "JUL" },
  { label: "August", value: "AUG" },
  { label: "September", value: "SEP" },
  { label: "October", value: "OCT" },
  { label: "November", value: "NOV" },
  { label: "December", value: "DEC" },
  { label: "Q1", value: "Q1" },
  { label: "Q2", value: "Q2" },
  { label: "Q3", value: "Q3" },
  { label: "Q4", value: "Q4" },
  { label: "Annually", value: "ANNUALLY" },
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
      <td
        colSpan={colCount}
        className="px-4 py-12 text-center text-sm text-gray-500"
      >
        No tasks found.
      </td>
    </tr>
  </tbody>
);

export default function TaxRecordTasksTable() {
  const { tasks, isFetching, error, refetch, page, totalPages, totalElements, setPage, filters, setClientFilter, setTaskNameFilter, setStatusFilter, setPeriodFilter, setAccountantFilter } = useTaxRecordTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canViewAll = hasPermission(user?.permissions, Permission.TASK_VIEW_ALL);
  const canReview = hasPermission(user?.permissions, Permission.TASK_REVIEW);
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const showAssignedTo = canViewAll || canReview;
  const showCreated = !canReview || canViewAll;

  const [clientOptions, setClientOptions] = useState<{ label: string; value: string }[]>([
    { label: "All Clients", value: "" },
  ]);
  const [taskNameOptions, setTaskNameOptions] = useState<{ label: string; value: string }[]>([
    { label: "All Tasks", value: "" },
  ]);
  const [accountantOptions, setAccountantOptions] = useState<{ label: string; value: string }[]>([
    { label: "All Accountants", value: "" },
  ]);

  useEffect(() => {
    taxRecordTaskAPI.getTaskNames().then((data) => {
      setTaskNameOptions([
        { label: "All Tasks", value: "" },
        ...data.map((t) => ({ label: t.name, value: String(t.id) })),
      ]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    clientAPI.getActiveClients().then((data) => {
      setClientOptions([
        { label: "All Clients", value: "" },
        ...data.map((c) => ({ label: c.displayName, value: c.id })),
      ]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!showAssignedTo) return;
    usersAPI.getAccountants("CSD,OOS").then((data) => {
      setAccountantOptions([
        { label: "All Accountants", value: "" },
        ...data.map((a) => ({ label: a.displayName, value: a.id })),
      ]);
    }).catch(() => {});
  }, [showAssignedTo]);

  const visibleHeaders = HEADERS.filter((h) => {
    if (!h.showWhen) return true;
    if (h.showWhen === "canViewAllOrReview") return showAssignedTo;
    if (h.showWhen === "notReviewOnly") return showCreated;
    return true;
  });

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

  function renderFilter(header: HeaderDef) {
    switch (header.filter) {
      case "client":
        return (
          <Dropdown
            headerStyle
            placeholder="Client Name"
            options={clientOptions}
            value={filters.clientId || ""}
            onChange={setClientFilter}
          />
        );
      case "taskName":
        return (
          <Dropdown
            headerStyle
            placeholder="Task"
            options={taskNameOptions}
            value={filters.taskNameId != null ? String(filters.taskNameId) : ""}
            onChange={(v) => setTaskNameFilter(v)}
          />
        );
      case "status":
        return (
          <Dropdown
            headerStyle
            placeholder="Status"
            options={statusOptions}
            value={(filters.status as string) || ""}
            onChange={setStatusFilter}
          />
        );
      case "period":
        return (
          <Dropdown
            headerStyle
            placeholder="Period"
            options={periodOptions}
            value={(filters.period as string) || ""}
            onChange={setPeriodFilter}
          />
        );
      case "accountant":
        return showAssignedTo ? (
          <Dropdown
            headerStyle
            placeholder="Assigned To"
            options={accountantOptions}
            value={filters.accountantId || ""}
            onChange={setAccountantFilter}
          />
        ) : null;
      default:
        return null;
    }
  }

  return (
    <div className="rounded-lg bg-white custom-shadow">
      <div>
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200">
              {visibleHeaders.map((header) => {
                const filter = renderFilter(header);
                return (
                  <th
                    key={header.label}
                    className={`${header.className} px-4 py-3 text-left align-middle`}
                  >
                    {filter ?? (
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {header.label}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          {isFetching ? (
            <TableSkeleton colCount={visibleHeaders.length} />
          ) : tasks.length === 0 ? (
            <EmptyState colCount={visibleHeaders.length} />
          ) : (
            <tbody>
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  showAssignedTo={showAssignedTo}
                  showCreated={showCreated}
                  onClick={() => navigate(`/${prefix}/tax-record-task/${task.id}`)}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>
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
