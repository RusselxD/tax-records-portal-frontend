import { formatNum } from "../../lib/formatters";

export interface DotItem {
  label: string;
  value: number;
  dot: string;
}

export default function DotList({ items }: { items: DotItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
      {items.map(({ label, value, dot }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
          <span className="text-xs text-gray-400">
            <span className="font-medium text-gray-600">{formatNum(value)}</span>{" "}
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
