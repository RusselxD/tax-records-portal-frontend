import type { ClientStatus } from "../../types/client";

const statusStyles: Record<ClientStatus, string> = {
  ONBOARDING: "bg-amber-50 text-amber-600 border border-amber-200",
  ACTIVE_CLIENT: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  OFFBOARDING: "bg-orange-50 text-orange-600 border border-orange-200",
  INACTIVE_CLIENT: "bg-gray-100 text-gray-500 border border-gray-200",
};

const statusLabels: Record<ClientStatus, string> = {
  ONBOARDING: "Onboarding",
  ACTIVE_CLIENT: "Active Client",
  OFFBOARDING: "Offboarding",
  INACTIVE_CLIENT: "Inactive Client",
};

const statusDotColors: Record<ClientStatus, string> = {
  ONBOARDING: "bg-amber-500",
  ACTIVE_CLIENT: "bg-emerald-500",
  OFFBOARDING: "bg-orange-500",
  INACTIVE_CLIENT: "bg-gray-400",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  lg: "px-4 py-2 text-sm gap-2",
};

const dotSizes = {
  sm: "h-1.5 w-1.5",
  lg: "h-2 w-2",
};

interface ClientStatusBadgeProps {
  status: ClientStatus;
  size?: "sm" | "lg";
}

export default function ClientStatusBadge({ status, size = "sm" }: ClientStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium flex-shrink-0 whitespace-nowrap ${sizeClasses[size]} ${statusStyles[status]}`}
    >
      <span className={`rounded-full ${dotSizes[size]} ${statusDotColors[status]}`} />
      {statusLabels[status]}
    </span>
  );
}
