import usePageTitle from "../../../../hooks/usePageTitle";
import MainMetrics from "./components/MainMetrics";
import TaskApprovalRate from "./components/TaskApprovalRate";
import TaskCompletionTrend from "./components/TaskCompletionTrend";

export default function AdminDashboard() {
  usePageTitle("Dashboard");

  return (
    <div className="space-y-4">
      <MainMetrics />
      <div className="flex gap-4">
        <TaskCompletionTrend />
        <TaskApprovalRate />
      </div>
    </div>
  );
}
