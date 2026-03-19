import type { ReactNode } from "react";

export interface ChartContainerProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function ChartContainer({
  title,
  action,
  children,
  className,
}: ChartContainerProps) {
  return (
    <div className={`rounded-lg bg-white custom-shadow px-5 py-4 ${className || ""}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-primary">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
