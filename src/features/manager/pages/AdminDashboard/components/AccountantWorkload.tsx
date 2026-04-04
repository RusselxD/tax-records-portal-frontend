import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../../../lib/api-error";
import { formatNum } from "../../../../../lib/formatters";
import type { AccountantWorkloadItem } from "../../../../../types/analytics";
import { systemAnalyticsAPI } from "../../../../../api/systemAnalytics";
import { ChartContainer } from "../../../../../components/common";
import { ErrorState } from "./chartShared";

function WorkloadRow({ item, maxTasks, rank }: { item: AccountantWorkloadItem; maxTasks: number; rank: number }) {
  const barPercent = maxTasks > 0 ? (item.activeTasks / maxTasks) * 100 : 0;
  const opacity = 1 - rank * 0.12;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 truncate" title={item.accountantName}>
          {item.accountantName}
        </span>
        <span className="text-sm font-semibold text-gray-900 tabular-nums ml-3 shrink-0">
          {formatNum(item.activeTasks)}
        </span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${barPercent}%`,
            backgroundColor: "#d0a865",
            opacity,
          }}
        />
      </div>
    </div>
  );
}

const ChartSkeleton = () => (
  <div className="flex-1 flex flex-col justify-between py-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i}>
        <div className="flex justify-between mb-1">
          <div className="skeleton h-3.5 rounded" style={{ width: `${7 + i}rem` }} />
          <div className="skeleton h-3.5 w-10 rounded" />
        </div>
        <div className="skeleton h-3 w-full rounded-full" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
    No accountant workload data available.
  </div>
);

export default function AccountantWorkload() {
  const [data, setData] = useState<AccountantWorkloadItem[] | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await systemAnalyticsAPI.getAccountantWorkload();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load workload data. Please try again."));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const maxTasks = data ? Math.max(...data.map((d) => d.activeTasks), 1) : 1;

  return (
    <ChartContainer
      title="Top Accountants by Workload"
      className="h-full min-h-0 flex flex-col"
      action={
        <Link to="/manager/analytics" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
          View all →
        </Link>
      }
    >
      {isFetching && <ChartSkeleton />}
      {!isFetching && error && <ErrorState message={error} onRetry={fetchData} />}
      {!isFetching && !error && data && (
        data.length === 0 ? <EmptyState /> : (
          <div className="flex-1 min-h-0 flex flex-col justify-between">
            {data.map((item, i) => (
              <WorkloadRow key={item.accountantName} item={item} maxTasks={maxTasks} rank={i} />
            ))}
          </div>
        )
      )}
    </ChartContainer>
  );
}
