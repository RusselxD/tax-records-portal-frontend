import type { ReactNode } from "react";
import { XCircle, AlertTriangle, CheckCircle, Info, type LucideIcon } from "lucide-react";

type AlertVariant = "error" | "warning" | "success" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, { bg: string; text: string }> = {
  error: { bg: "bg-red-50", text: "text-status-rejected" },
  warning: { bg: "bg-amber-50", text: "text-status-pending" },
  success: { bg: "bg-green-50", text: "text-status-approved" },
  info: { bg: "bg-blue-50", text: "text-accent" },
};

const icons: Record<AlertVariant, LucideIcon> = {
  error: XCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

export default function Alert({
  variant = "info",
  children,
  className = "",
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = icons[variant];

  return (
    <div
      className={`flex items-center gap-2 rounded-md p-3 text-sm ${styles.bg} ${styles.text} ${className}`}
      role="alert"
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {children}
    </div>
  );
}
