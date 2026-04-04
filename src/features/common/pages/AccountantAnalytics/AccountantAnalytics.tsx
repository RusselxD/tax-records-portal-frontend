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

interface AccountantAnalyticsContentProps {
  userId?: string;
  roleKey?: string;
}

export function AccountantAnalyticsContent({
  userId,
  roleKey,
}: AccountantAnalyticsContentProps) {
  const { user } = useAuth();
  const effectiveRoleKey = roleKey ?? user?.roleKey;
  const isOos = effectiveRoleKey === UserRole.OOS;

  return (
    <div className="space-y-4">
      <TaskSummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <TasksByCategoryChart />
        <div className="flex flex-col gap-4 min-h-0">
          <OnTimeRateWidget className="flex-1 min-h-0" />
          <QualityMetricsWidget className="flex-1 min-h-0" />
        </div>
      </div>

      <div className={`grid gap-4 ${isOos ? "grid-cols-1 lg:grid-cols-[1fr_320px]" : "grid-cols-1"}`}>
        <MonthlyThroughputChart userId={userId} />
        {isOos && <OnboardingPipelineWidget />}
      </div>

      <ClientPortfolioTable userId={userId} />
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
