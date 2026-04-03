import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "../../../../../components/common";
import { useAccountantAnalytics } from "../context/AccountantAnalyticsContext";
const MIN_CHART_HEIGHT = 200;
const ROW_HEIGHT = 50; // height per category row

const Skeleton = () => <div className="skeleton rounded-lg" style={{ height: MIN_CHART_HEIGHT }} />;

const EmptyState = () => (
  <div
    className="flex items-center justify-center text-sm text-gray-400"
    style={{ height: MIN_CHART_HEIGHT }}
  >
    No task data available yet.
  </div>
);

export default function TasksByCategoryChart() {
  const { byCategory } = useAccountantAnalytics();
  const { data, loading, error, retry } = byCategory;

  return (
    <ChartContainer title="Tasks by Category">
      <div>
        {loading && <Skeleton />}

        {!loading && error && (
          <div
            className="flex items-center justify-center text-sm text-status-rejected"
            style={{ height: MIN_CHART_HEIGHT }}
          >
            <span>{error}</span>
            <button
              onClick={retry}
              className="ml-2 underline hover:no-underline font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && data && (
          data.data.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(MIN_CHART_HEIGHT, data.data.length * ROW_HEIGHT + 40)}>
              <BarChart
                data={data.data.map((d) => ({
                  category: d.category,
                  Active: d.active,
                  Completed: d.completed,
                }))}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 8, bottom: 5 }}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#374151" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    fontSize: 13,
                  }}
                  cursor={{ fill: "rgba(47, 111, 237, 0.04)" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                />
                <Bar
                  dataKey="Active"
                  fill="#2F6FED"
                  radius={[0, 8, 8, 0]}
                  barSize={Math.max(8, Math.min(32, Math.floor(160 / data.data.length)))}
                />
                <Bar
                  dataKey="Completed"
                  fill="#16A34A"
                  radius={[0, 4, 4, 0]}
                  barSize={Math.max(8, Math.min(32, Math.floor(160 / data.data.length)))}
                />
              </BarChart>
            </ResponsiveContainer>
          )
        )}
      </div>
    </ChartContainer>
  );
}
