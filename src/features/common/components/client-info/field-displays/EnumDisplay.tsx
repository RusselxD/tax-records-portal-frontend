import DisplayField from "./DisplayField";

interface EnumDisplayProps {
  label: string;
  value: string | null | undefined;
  labels: Record<string, string>;
  fullWidth?: boolean;
}

export default function EnumDisplay({ label, value, labels, fullWidth }: EnumDisplayProps) {
  if (!value) return null;

  return (
    <DisplayField label={label} fullWidth={fullWidth}>
      <p className="text-sm text-primary font-medium">{labels[value] ?? value}</p>
    </DisplayField>
  );
}
