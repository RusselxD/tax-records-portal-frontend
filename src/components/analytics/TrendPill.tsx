import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function TrendPill({
  percentChange,
}: {
  percentChange: number | null;
}) {
  if (percentChange == null) {
    return <span className="text-xs text-gray-400">No data last month</span>;
  }

  const isPositive = percentChange >= 0;
  const Arrow = isPositive ? ArrowUpRight : ArrowDownRight;
  const bg = isPositive ? "bg-emerald-100" : "bg-red-50";
  const text = isPositive ? "text-emerald-700" : "text-status-rejected";
  const sign = isPositive ? "+" : "";

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${bg} ${text}`}
    >
      <Arrow className="w-3 h-3" />
      {sign}{percentChange.toFixed(1)}%
    </span>
  );
}
