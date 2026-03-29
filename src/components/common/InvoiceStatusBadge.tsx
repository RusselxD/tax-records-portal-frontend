import type { InvoiceStatus } from "../../types/invoice";
import StatusBadge, { type StatusBadgeConfig } from "./StatusBadge";

const invoiceStatusConfig: Record<InvoiceStatus, StatusBadgeConfig> = {
  UNPAID: {
    label: "Unpaid",
    className: "bg-red-50 text-red-600 border border-red-200",
    dotColor: "bg-red-500",
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    className: "bg-amber-50 text-amber-600 border border-amber-200",
    dotColor: "bg-amber-500",
  },
  FULLY_PAID: {
    label: "Fully Paid",
    className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  VOID: {
    label: "Void",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
    dotColor: "bg-gray-400",
  },
};

export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <StatusBadge config={invoiceStatusConfig} status={status} sizeClassName="px-3 py-1 text-xs gap-1.5" />;
}
