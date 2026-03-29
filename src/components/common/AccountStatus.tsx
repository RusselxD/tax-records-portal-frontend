import type { UserStatus } from "../../types/user";
import StatusBadge, { type StatusBadgeConfig } from "./StatusBadge";

export interface AccountStatusProps {
  status: UserStatus;
}

const accountStatusConfig: Record<UserStatus, StatusBadgeConfig> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-600 border border-amber-200",
    dotColor: "bg-amber-500",
  },
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  DEACTIVATED: {
    label: "Deactivated",
    className: "bg-gray-50 text-gray-500 border border-gray-200",
    dotColor: "bg-gray-400",
  },
};

export default function AccountStatus({ status }: AccountStatusProps) {
  return <StatusBadge config={accountStatusConfig} status={status} sizeClassName="px-3 py-0.5 text-xs gap-1.5" />;
}
