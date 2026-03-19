import { FileText } from "lucide-react";
import { FilePreviewButton } from "../../../../../components/common";
import type { FileReference } from "../../../../../types/client-info";
import DisplayField from "./DisplayField";

interface FileDisplayProps {
  label: string;
  value: FileReference | null | undefined;
  fullWidth?: boolean;
}

export default function FileDisplay({ label, value, fullWidth }: FileDisplayProps) {
  if (!value) return null;

  return (
    <DisplayField label={label} fullWidth={fullWidth}>
      <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
        <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <span className="flex-1 leading-relaxed">{value.name}</span>
        <FilePreviewButton fileId={value.id} fileName={value.name} />
      </div>
    </DisplayField>
  );
}
