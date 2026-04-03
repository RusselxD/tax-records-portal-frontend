import type { ReactNode } from "react";

export interface InfoFieldProps {
  label: string;
  value?: string;
  children?: ReactNode;
}

export default function InfoField({ label, value, children }: InfoFieldProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-700 leading-relaxed break-words">
        {children ?? value ?? "—"}
      </dd>
    </div>
  );
}
