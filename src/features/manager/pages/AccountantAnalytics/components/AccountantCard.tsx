import { Link } from "react-router-dom";
import { UserAvatar } from "../../../../../components/common";
import type { AccountantOverviewItem } from "../../../../../types/analytics";

const roleBadgeStyles: Record<string, string> = {
  CSD: "bg-blue-50 text-blue-700 border border-blue-200",
  OOS: "bg-amber-50 text-amber-700 border border-amber-200",
};

const roleLabels: Record<string, string> = {
  CSD: "Client Service Delivery",
  OOS: "Onboarding, Offboarding & Support",
};

interface AccountantCardProps {
  accountant: AccountantOverviewItem;
}

export default function AccountantCard({ accountant: a }: AccountantCardProps) {
  return (
    <Link
      to={`/manager/accountant-analytics/${a.id}`}
      state={{ roleKey: a.roleKey, name: a.name }}
      className="bg-white rounded-lg custom-shadow p-5 hover:shadow-md transition-shadow block"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <UserAvatar name={a.name} profileUrl={a.profileUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-primary leading-snug">
            {a.name}
          </h3>
          {a.position && (
            <p className="text-xs text-gray-500 mt-0.5">{a.position}</p>
          )}
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium mt-1.5 ${
              roleBadgeStyles[a.roleKey] ??
              "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            {roleLabels[a.roleKey] ?? a.roleKey}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{a.activeTasks}</p>
          <p className="text-xs text-gray-400 mt-0.5">Active Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{a.assignedClients}</p>
          <p className="text-xs text-gray-400 mt-0.5">Assigned Clients</p>
        </div>
        <div className="text-center">
          <p
            className={`text-lg font-bold ${
              a.overdueTasks > 0 ? "text-status-rejected" : "text-primary"
            }`}
          >
            {a.overdueTasks}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Overdue Tasks</p>
        </div>
      </div>
    </Link>
  );
}
