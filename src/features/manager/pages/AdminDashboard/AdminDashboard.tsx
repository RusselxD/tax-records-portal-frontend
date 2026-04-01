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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskCompletionTrend />
        <TaskApprovalRate />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
        <AccountantWorkload />
        <TasksByCategory />
      </div>
    </div>
  );
}
