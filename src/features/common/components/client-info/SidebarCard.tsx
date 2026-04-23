import type { ReactNode } from "react";

export default function SidebarCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-white border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-bold text-primary">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
