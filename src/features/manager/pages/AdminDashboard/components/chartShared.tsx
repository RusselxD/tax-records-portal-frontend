import type { DropdownOption } from "../../../../../components/common";

export const rangeOptions: DropdownOption[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 1 Month", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
];

export const ErrorState = ({
  message,
  onRetry,
  className = "h-[280px]",
}: {
  message: string;
  onRetry: () => void;
  className?: string;
}) => (
  <div className={`${className} flex items-center justify-center text-sm text-status-rejected`}>
    <span>{message}</span>
    <button onClick={onRetry} className="ml-2 underline hover:no-underline font-medium">
      Retry
    </button>
  </div>
);
