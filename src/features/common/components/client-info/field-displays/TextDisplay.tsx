import DisplayField from "./DisplayField";

interface TextDisplayProps {
  label: string;
  value: string | number | null | undefined;
  fullWidth?: boolean;
}

export default function TextDisplay({ label, value, fullWidth }: TextDisplayProps) {
  if (value === null || value === undefined || String(value).trim() === "") return null;

  return (
    <DisplayField label={label} fullWidth={fullWidth}>
      <p className="text-sm text-primary font-medium leading-relaxed">{value}</p>
    </DisplayField>
  );
}
