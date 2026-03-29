import type { ClientStatus } from "../../types/client";
import StatusBadge, { type StatusBadgeConfig } from "./StatusBadge";

const clientStatusConfig: Record<ClientStatus, StatusBadgeConfig> = {
  ONBOARDING: {
    label: "Onboarding",
    className: "bg-amber-50 text-amber-600 border border-amber-200",
    dotColor: "bg-amber-500",
  },
  ACTIVE_CLIENT: {
    label: "Active Client",
    className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  OFFBOARDING: {
    label: "Offboarding",
    className: "bg-orange-50 text-orange-600 border border-orange-200",
    dotColor: "bg-orange-500",
  },
  INACTIVE_CLIENT: {
    label: "Inactive Client",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
    dotColor: "bg-gray-400",
  },
};

interface ClientStatusBadgeProps {
  status: ClientStatus;
  size?: "sm" | "lg";
}

export default function ClientStatusBadge({ status, size = "sm" }: ClientStatusBadgeProps) {
  return <StatusBadge config={clientStatusConfig} status={status} size={size} />;
}
