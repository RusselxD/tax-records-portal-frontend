import { useCallback } from "react";
import { ClipboardList, Send, FileCheck, FolderCheck } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { taxRecordTaskAPI } from "../../../../api/tax-record-task";
import NeedsAttention from "./components/NeedsAttention";
import TaskStats from "./components/TaskStats";
import TaskList from "./components/TaskList";

export default function Dashboard() {
  usePageTitle("Dashboard");

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
      <NeedsAttention />
      <TaskList
        title="To-do List"
        icon={<ClipboardList className="w-4 h-4" />}
        fetchFn={fetchTodo}
        showStatus
        defaultOpen
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
