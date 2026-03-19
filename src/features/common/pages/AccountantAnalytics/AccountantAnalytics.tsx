import { useAuth } from "../../../../contexts/AuthContext";
import { UserRole } from "../../../../constants/roles";
import usePageTitle from "../../../../hooks/usePageTitle";
import { AccountantAnalyticsProvider } from "./context/AccountantAnalyticsContext";
import TaskSummaryCards from "./components/TaskSummaryCards";
import MonthlyThroughputChart from "./components/MonthlyThroughputChart";
import OnTimeRateWidget from "./components/OnTimeRateWidget";
import QualityMetricsWidget from "./components/QualityMetricsWidget";
import TasksByCategoryChart from "./components/TasksByCategoryChart";
import OnboardingPipelineWidget from "./components/OnboardingPipelineWidget";
import ClientPortfolioTable from "./components/ClientPortfolioTable";

function AccountantAnalyticsContent() {
  const { user } = useAuth();
  const isOos = user?.roleKey === UserRole.OOS;

  return (
    <div className="space-y-4">
      {/* Row 1: KPI cards */}
      <TaskSummaryCards />

      {/* Row 2: Tasks by Category (left) | On-Time Rate + Quality Metrics stacked (right) */}
      <div className="flex gap-4">
        <TasksByCategoryChart />
        <div className="flex flex-col gap-4 w-80 shrink-0">
          <OnTimeRateWidget />
          <QualityMetricsWidget />
        </div>
      </div>

      {/* Row 3: Monthly Throughput + optional OOS Pipeline */}
      <div className="flex gap-4 items-start">
        <MonthlyThroughputChart />
        {isOos && (
          <div className="w-80 shrink-0">
            <OnboardingPipelineWidget />
          </div>
        )}
      </div>

      {/* Row 4: Client portfolio table */}
      <ClientPortfolioTable />
    </div>
  );
}

export default function AccountantAnalytics() {
  usePageTitle("My Analytics");

  return (
    <AccountantAnalyticsProvider>
      <AccountantAnalyticsContent />
    </AccountantAnalyticsProvider>
  );
}
