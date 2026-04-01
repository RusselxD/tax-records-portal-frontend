import {
  Layers,
  FolderOpen,
  GitBranch,
  CalendarDays,
  Clock,
  ClipboardList,
} from "lucide-react";
import type { TaxRecordEntryResponse } from "../../../../../../../types/tax-record";
import { periodLabels } from "../../../../../../../constants/tax-record-task";

interface RecordDetailsProps {
  record: TaxRecordEntryResponse;
}

export default function RecordDetails({ record }: RecordDetailsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
      <div className="flex items-center gap-2 mb-5">
        <Layers className="h-4 w-4 text-accent" />
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Record Details
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
        <DetailField
          icon={<FolderOpen className="h-3.5 w-3.5 text-violet-500" />}
          label="Category"
          value={record.categoryName}
        />
        <DetailField
          icon={<GitBranch className="h-3.5 w-3.5 text-blue-500" />}
          label="Sub Category"
          value={record.subCategoryName}
        />
        <DetailField
          icon={<CalendarDays className="h-3.5 w-3.5 text-amber-500" />}
          label="Year"
          value={String(record.year)}
        />
        <DetailField
          icon={<Clock className="h-3.5 w-3.5 text-rose-500" />}
          label="Period"
          value={periodLabels[record.period] ?? record.period}
        />
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <DetailField
          icon={<ClipboardList className="h-3.5 w-3.5 text-indigo-500" />}
          label="Task"
          value={record.taskName}
        />
      </div>
    </div>
  );
}

function DetailField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-sm font-medium text-primary leading-relaxed">{value}</p>
    </div>
  );
}
