import { useCallback } from "react";
import { ClipboardList, Send, FileCheck, FolderCheck, Clock, XCircle } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { taxRecordTaskAPI } from "../../../../api/tax-record-task";
import TaskStats from "./components/TaskStats";
import TaskList from "./components/TaskList";

export default function Dashboard() {
  usePageTitle("Dashboard");

  const fetchOverdue = useCallback(
    (page: number, size: number) => taxRecordTaskAPI.getOverdueTasks(page, size),
    [],
  );
  const fetchRejected = useCallback(
    (page: number, size: number) => taxRecordTaskAPI.getRejectedTasks(page, size),
    [],
  );
  const fetchTodo = useCallback(
    (page: number, size: number) => taxRecordTaskAPI.getTodoTasks(page, size),
    [],
  );
  const fetchSubmitted = useCallback(
    (page: number, size: number) => taxRecordTaskAPI.getSubmittedTasks(page, size),
    [],
  );
  const fetchForFiling = useCallback(
    (page: number, size: number) => taxRecordTaskAPI.getForFilingTasks(page, size),
    [],
  );
  const fetchFiled = useCallback(
    (page: number, size: number) => taxRecordTaskAPI.getFiledTasks(page, size),
    [],
  );

  return (
    <div className="space-y-4">
      <TaskStats />
      <TaskList
        title="Overdue Tasks"
        icon={<Clock className="w-4 h-4" />}
        fetchFn={fetchOverdue}
        showStatus
        accent="red"
        emptyMessage="No overdue tasks — you're on track."
        hideWhenEmpty
      />
      <TaskList
        title="Rejected Tasks"
        icon={<XCircle className="w-4 h-4" />}
        fetchFn={fetchRejected}
        accent="red"
        emptyMessage="No rejected tasks right now."
        hideWhenEmpty
      />
      <TaskList
        title="To-do List"
        icon={<ClipboardList className="w-4 h-4" />}
        fetchFn={fetchTodo}
        showStatus
        accent="navy"
        emptyMessage="You're all caught up — no tasks to do right now."
      />
      <TaskList
        title="Submitted For Review"
        icon={<Send className="w-4 h-4" />}
        fetchFn={fetchSubmitted}
        accent="amber"
      />
      <TaskList
        title="Approved For Filing"
        icon={<FileCheck className="w-4 h-4" />}
        fetchFn={fetchForFiling}
        accent="emerald"
      />
      <TaskList
        title="Filed & Waiting for Confirmation"
        icon={<FolderCheck className="w-4 h-4" />}
        fetchFn={fetchFiled}
        accent="sky"
      />
    </div>
  );
}
