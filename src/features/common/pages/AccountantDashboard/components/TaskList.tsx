import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { TaxRecordTaskStatus, Period } from "../../../../../types/tax-record-task";
import { TAX_RECORD_TASK_STATUS } from "../../../../../types/tax-record-task";
import { formatDate } from "../../../../../lib/formatters";
import { getErrorMessage } from "../../../../../lib/api-error";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants/roles";
import {
  statusLabels,
  statusStyles,
  rowBgColors,
  periodLabels,
} from "../../../../../constants/tax-record-task";

const PAGE_SIZE = 10;

interface TaskItem {
  id: string;
  clientName: string;
  categoryName: string;
  subCategoryName: string;
  taskName: string;
  year: number;
  period: Period;
  deadline: string;
  createdBy: string;
  createdAt: string;
  status?: TaxRecordTaskStatus;
  isOverdue?: boolean;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton h-12 rounded-md" />
      ))}
    </div>
  );
}

interface TaskListProps {
  title: string;
  icon: React.ReactNode;
  fetchFn: (page: number, size: number) => Promise<PageResponse<TaskItem>>;
  showStatus?: boolean;
  emptyMessage?: string;
  defaultOpen?: boolean;
}

export default function TaskList({
  title,
  icon,
  fetchFn,
  showStatus = false,
  emptyMessage = "No tasks here right now.",
  defaultOpen = false,
}: TaskListProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(defaultOpen);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFn(page, PAGE_SIZE);
        if (!cancelled) {
          setTasks(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [page, fetchFn]);

  const handleRowClick = (id: string) => {
    const prefix = getRolePrefix(user?.roleKey ?? "");
    navigate(`/${prefix}/tax-record-task/${id}`);
  };

  const colCount = showStatus ? 6 : 5;
  const startItem = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const endItem = Math.min((page + 1) * PAGE_SIZE, totalElements);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex custom-shadow items-center text-sm gap-2 font-medium bg-white border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50 rounded-lg"
      >
        {icon}
        <span>{title}</span>
        <span className="text-gray-400">{`(${totalElements})`}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {isLoading ? (
            <div className="mt-2">
              <TableSkeleton />
            </div>
          ) : error ? (
            <div className="mt-2 bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={() => setPage(0)}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="mt-2 bg-white rounded-lg custom-shadow border border-gray-200 overflow-hidden">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className={`th-label ${showStatus ? "w-[22%]" : "w-[22%]"}`}>Client Name</th>
                    <th className={`th-label ${showStatus ? "w-[25%]" : "w-[30%]"}`}>Task</th>
                    <th className={`th-label ${showStatus ? "w-[8%]" : "w-[10%]"}`}>Period</th>
                    {showStatus && <th className="th-label w-[10%]">Status</th>}
                    <th className={`th-label ${showStatus ? "w-[12%]" : "w-[14%]"}`}>Deadline</th>
                    <th className={`th-label ${showStatus ? "w-[16%]" : "w-[18%]"}`}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={colCount}
                        className="px-4 py-12 text-center text-sm text-gray-400"
                      >
                        {emptyMessage}
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => {
                      const isOverdue = task.isOverdue ?? false;
                      const isRejected = task.status === TAX_RECORD_TASK_STATUS.REJECTED;

                      return (
                        <tr
                          key={task.id}
                          onClick={() => handleRowClick(task.id)}
                          className={`border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50/80 cursor-pointer ${showStatus && task.status ? rowBgColors[task.status] : ""} ${isOverdue ? "bg-red-50/40" : ""}`}
                        >
                          <td
                            className={`px-4 py-3.5 max-w-0 ${showStatus && (isOverdue || isRejected) ? "border-l-4 border-l-red-400" : ""}`}
                          >
                            <span
                              className="block truncate text-sm font-medium text-gray-800"
                              title={task.clientName}
                            >
                              {task.clientName}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 max-w-0">
                            <span
                              className="block truncate text-sm text-gray-700"
                              title={task.taskName}
                            >
                              {task.taskName}
                            </span>
                            <span
                              className="block truncate text-xs text-gray-600 mt-0.5"
                              title={`${task.categoryName} › ${task.subCategoryName}`}
                            >
                              {task.categoryName} › {task.subCategoryName}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="block text-sm text-gray-700">
                              {task.year}
                            </span>
                            <span className="block text-xs text-gray-600 mt-0.5">
                              {periodLabels[task.period] || task.period}
                            </span>
                          </td>
                          {showStatus && task.status && (
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${statusStyles[task.status]}`}
                              >
                                {statusLabels[task.status]}
                              </span>
                            </td>
                          )}
                          <td
                            className={`px-4 py-3.5 text-sm whitespace-nowrap ${isOverdue ? "font-medium text-red-500" : "text-gray-600"}`}
                          >
                            {formatDate(task.deadline)}
                          </td>
                          <td className="px-4 py-3.5 max-w-0">
                            <span
                              className="block truncate text-sm text-gray-600"
                              title={task.createdBy}
                            >
                              {task.createdBy}
                            </span>
                            <span className="block text-xs text-gray-400 mt-0.5">
                              {formatDate(task.createdAt)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {startItem}–{endItem} of {totalElements}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 0}
                      className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600 px-2">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= totalPages - 1}
                      className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
