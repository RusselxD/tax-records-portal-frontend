import type { ReactNode } from "react";

export function P({ children }: { children: ReactNode }) {
  return <p className="text-sm text-gray-600 leading-relaxed">{children}</p>;
}

export function Heading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-primary mt-2">{children}</h3>
  );
}

export function Steps({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-600 ml-1">
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ol>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-1">
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function StatusTable({
  rows,
}: {
  rows: { status: string; color: string; description: string }[];
}) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              What It Means
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.status} className="border-t border-gray-100">
              <td className="px-4 py-2.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${row.color}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-2.5 text-gray-600">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
      <span className="text-blue-500 text-sm shrink-0">Tip:</span>
      <p className="text-sm text-blue-700 leading-relaxed">{children}</p>
    </div>
  );
}
