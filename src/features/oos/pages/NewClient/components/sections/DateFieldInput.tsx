import { Input } from "../../../../../../components/common";
import type { DateField } from "../../../../../../types/client-info";

interface DateFieldInputProps {
  label: string;
  value: DateField | null;
  onChange: (value: DateField | null) => void;
}

function normalizeDate(date: unknown): string {
  if (!date) return "";
  if (typeof date === "string") return date;
  if (Array.isArray(date)) {
    const [y, m, d] = date;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  return "";
}

export default function DateFieldInput({
  label,
  value,
  onChange,
}: DateFieldInputProps) {
  const dateValue = normalizeDate(value?.date);
  const isImportant = value?.isImportant ?? false;
  const isCritical = value?.isCritical ?? false;

  const emit = (patch: Partial<DateField>) => {
    const next = { date: dateValue || null, isImportant, isCritical, ...patch };
    if (!next.date && !next.isImportant && !next.isCritical) {
      onChange(null);
    } else {
      onChange(next);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    emit({ date: e.target.value || null });
  };

  const handleImportantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    emit({ isImportant: e.target.checked });
  };

  const handleCriticalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    emit({ isCritical: e.target.checked });
  };

  return (
    <div>
      <Input
        label={label}
        type="date"
        value={dateValue}
        onChange={handleDateChange}
      />
      <div className="mt-1.5 flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          <input
            type="checkbox"
            checked={isImportant}
            onChange={handleImportantChange}
            className="rounded border-gray-300 text-accent focus:ring-accent h-3 w-3"
          />
          Mark as important
        </label>
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          <input
            type="checkbox"
            checked={isCritical}
            onChange={handleCriticalChange}
            className="rounded border-gray-300 text-red-500 focus:ring-red-500 h-3 w-3"
          />
          Mark as critical
        </label>
      </div>
    </div>
  );
}
