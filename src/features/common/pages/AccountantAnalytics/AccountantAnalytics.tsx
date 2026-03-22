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

      <div className="flex gap-4">
        <TasksByCategoryChart />
        <div className="flex flex-col gap-4 w-80 shrink-0">
          <OnTimeRateWidget />
          <QualityMetricsWidget />
        </div>
      </div>

      <div className="flex gap-4 items-stretch">
        <MonthlyThroughputChart userId={userId} />
        {isOos && (
          <div className="w-80 shrink-0">
            <OnboardingPipelineWidget />
          </div>
        )}
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
