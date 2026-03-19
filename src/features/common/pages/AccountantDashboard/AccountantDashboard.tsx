import usePageTitle from "../../../../hooks/usePageTitle";
import NeedsAttention from "./components/NeedsAttention";
import TaskStats from "./components/TaskStats";
import TodoList from "./components/TodoList";

export default function Dashboard() {
  usePageTitle("Dashboard");

  return (
    <div className="space-y-5">
      <TaskStats />
      <NeedsAttention />
      <TodoList />
    </div>
  );
}
