import type { ReactNode } from "react";

export interface StatCardProps {
  label: string;
  valueDisplay: string;
  subtitle?: ReactNode;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  pill?: { label: string; bg: string; text: string };
}

export default function StatCard({
  label,
  valueDisplay,
  subtitle,
  icon,
  iconBg,
  iconColor,
  pill,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg custom-shadow p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <div className={`p-2.5 rounded-full ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <div className="flex items-baseline gap-2.5 mt-1">
        <span className="text-3xl font-bold text-primary leading-tight">
          {valueDisplay}
        </span>
        {pill && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pill.bg} ${pill.text}`}
          >
            {pill.label}
          </span>
        )}
      </div>
      {subtitle && <div className="mt-1 text-sm">{subtitle}</div>}
    </div>
  );
}
