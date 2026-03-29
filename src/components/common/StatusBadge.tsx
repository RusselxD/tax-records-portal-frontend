export interface StatusBadgeConfig {
  label: string;
  className: string;
  dotColor: string;
}

export interface StatusBadgeProps {
  config: Record<string, StatusBadgeConfig>;
  status: string;
  size?: "sm" | "lg";
  /** Override the default size classes (padding, text size, gap) */
  sizeClassName?: string;
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  lg: "px-4 py-2 text-sm gap-2",
};

const dotSizes = {
  sm: "h-1.5 w-1.5",
  lg: "h-2 w-2",
};

const fallback: StatusBadgeConfig = {
  label: "Unknown",
  className: "bg-gray-100 text-gray-500 border border-gray-200",
  dotColor: "bg-gray-400",
};

export default function StatusBadge({ config, status, size = "sm", sizeClassName }: StatusBadgeProps) {
  const entry = config[status] ?? fallback;
  const resolvedSize = sizeClassName ?? sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium flex-shrink-0 whitespace-nowrap ${resolvedSize} ${entry.className}`}
    >
      <span className={`rounded-full ${dotSizes[size]} ${entry.dotColor}`} />
      {entry.label}
    </span>
  );
}
