import type { ReactNode } from "react";

interface DisplayFieldProps {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function DisplayField({ label, children, fullWidth }: DisplayFieldProps) {
  return (
    <div className={fullWidth ? "col-span-2" : undefined}>
      <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </div>
  );
}
