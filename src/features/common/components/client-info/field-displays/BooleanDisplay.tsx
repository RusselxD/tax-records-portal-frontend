import DisplayField from "./DisplayField";

interface BooleanDisplayProps {
  label: string;
  value: boolean | null | undefined;
  fullWidth?: boolean;
}

export default function BooleanDisplay({ label, value, fullWidth }: BooleanDisplayProps) {
  if (value === null || value === undefined) return null;

  return (
    <DisplayField label={label} fullWidth={fullWidth}>
      <p className="text-sm text-primary font-medium">{value ? "Yes" : "No"}</p>
    </DisplayField>
  );
}
