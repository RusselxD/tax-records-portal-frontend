import type { UserStatus } from "../../types/user";

export interface AccountStatusProps {
  status: UserStatus;
}

const styles: Record<UserStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  DEACTIVATED: "bg-gray-50 text-gray-500 border border-gray-200",
};

const dotColors: Record<UserStatus, string> = {
  PENDING: "bg-amber-500",
  ACTIVE: "bg-emerald-500",
  DEACTIVATED: "bg-gray-400",
};

const labels: Record<UserStatus, string> = {
  PENDING: "Pending",
  ACTIVE: "Active",
  DEACTIVATED: "Deactivated",
};

export default function AccountStatus({ status }: AccountStatusProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`} />
      {labels[status]}
    </span>
  );
}
