import type { InvoiceStatus } from "../../types/invoice";

const statusConfig: Record<InvoiceStatus, { label: string; style: string; dot: string }> = {
  UNPAID: {
    label: "Unpaid",
    style: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-500",
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    style: "bg-amber-50 text-amber-600 border border-amber-200",
    dot: "bg-amber-500",
  },
  FULLY_PAID: {
    label: "Fully Paid",
    style: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  VOID: {
    label: "Void",
    style: "bg-gray-100 text-gray-500 border border-gray-200",
    dot: "bg-gray-400",
  },
};

export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${config.style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
