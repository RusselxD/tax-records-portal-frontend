import { ExternalLink } from "lucide-react";
import type { LinkReference } from "../../../../../types/client-info";
import DisplayField from "./DisplayField";

interface LinkDisplayProps {
  label: string;
  value: LinkReference | null | undefined;
  fullWidth?: boolean;
}

export default function LinkDisplay({ label, value, fullWidth }: LinkDisplayProps) {
  if (!value?.url) return null;

  return (
    <DisplayField label={label} fullWidth={fullWidth}>
      <a
        href={value.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-accent font-medium hover:underline"
      >
        {value.label || value.url}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </DisplayField>
  );
}
