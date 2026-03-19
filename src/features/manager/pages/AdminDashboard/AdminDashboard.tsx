import usePageTitle from "../../../../hooks/usePageTitle";
import MainMetrics from "./components/MainMetrics";
import TaskApprovalRate from "./components/TaskApprovalRate";
import TaskCompletionTrend from "./components/TaskCompletionTrend";
import AccountantWorkload from "./components/AccountantWorkload";
import TasksByCategory from "./components/TasksByCategory";

export default function AdminDashboard() {
  usePageTitle("Dashboard");

  return (
    <div className="space-y-4">
      <MainMetrics />
      <div className="flex gap-4">
        <TaskCompletionTrend />
        <TaskApprovalRate />
      </div>
      <div className="flex gap-4">
        <div className="w-2/5 shrink-0">
          <AccountantWorkload />
        </div>
        <div className="flex-1">
          <TasksByCategory />
        </div>
      </div>
    </div>
  );
}
