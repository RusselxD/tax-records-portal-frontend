import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../../constants/permissions";
import { getRolePrefix } from "../../../../../../constants/roles";
import { useTaxRecordTasks } from "../../context/TaxRecordTasksContext";
import TaskRow from "./components/TaskRow";
import Pagination from "./components/Pagination";

interface HeaderDef {
  label: string;
  className: string;
  showWhen?: "canViewAllOrReview" | "notReviewOnly";
}

const HEADERS: HeaderDef[] = [
  { label: "Client Name", className: "w-[18%] min-w-[160px]" },
  { label: "Task", className: "w-[25%] min-w-[220px]" },
  { label: "Period", className: "w-[7%] min-w-[80px]" },
  { label: "Status", className: "w-[14%] min-w-[150px]" },
  { label: "Deadline", className: "w-[10%] min-w-[100px]" },
  { label: "Assigned To", className: "w-[12%] min-w-[120px]", showWhen: "canViewAllOrReview" },
  { label: "Created", className: "w-[14%] min-w-[150px]", showWhen: "notReviewOnly" },
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
  const { tasks, isFetching, error, refetch } = useTaxRecordTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canViewAll = hasPermission(user?.permissions, Permission.TASK_VIEW_ALL);
  const canReview = hasPermission(user?.permissions, Permission.TASK_REVIEW);
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const showAssignedTo = canViewAll || canReview;
  const showCreated = !canReview || canViewAll;

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

  return (
    <div className="rounded-lg bg-white custom-shadow">
      <div className="overflow-x-auto">
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
      <Pagination />
    </div>
  );
}
