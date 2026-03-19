import type { ReactNode } from "react";

export default function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-white border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-bold text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
}
