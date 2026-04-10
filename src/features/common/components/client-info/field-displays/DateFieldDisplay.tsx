import { Star, Flame } from "lucide-react";
import { formatDate } from "../../../../../lib/formatters";
import type { DateField } from "../../../../../types/client-info";
import DisplayField from "./DisplayField";

interface DateFieldDisplayProps {
  label: string;
  value: DateField | null | undefined;
  fullWidth?: boolean;
}

export default function DateFieldDisplay({ label, value, fullWidth }: DateFieldDisplayProps) {
  if (!value?.date && !value?.notApplicable) return null;

  return (
    <DisplayField label={label} fullWidth={fullWidth}>
      {value.notApplicable ? (
        <p className="text-sm text-gray-400 italic">N/A</p>
      ) : (
        <div className="flex items-center gap-1.5">
          <p className="text-sm text-primary font-medium">{formatDate(value.date!)}</p>
          {value.isCritical && (
            <Flame className="h-3.5 w-3.5 text-red-500 fill-red-500" />
          )}
          {value.isImportant && !value.isCritical && (
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          )}
        </div>
      )}
    </DisplayField>
  );
}
