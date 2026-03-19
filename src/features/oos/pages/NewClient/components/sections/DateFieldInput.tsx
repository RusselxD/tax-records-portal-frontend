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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value || null;
    if (!newDate && !isImportant) {
      onChange(null);
    } else {
      onChange({ date: newDate, isImportant });
    }
  };

  const handleImportantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newImportant = e.target.checked;
    if (!dateValue && !newImportant) {
      onChange(null);
    } else {
      onChange({ date: dateValue || null, isImportant: newImportant });
    }
  };

  return (
    <div>
      <Input
        label={label}
        type="date"
        value={dateValue}
        onChange={handleDateChange}
      />
      <label className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
        <input
          type="checkbox"
          checked={isImportant}
          onChange={handleImportantChange}
          className="rounded border-gray-300 text-accent focus:ring-accent h-3 w-3"
        />
        Mark as important
      </label>
    </div>
  );
}
