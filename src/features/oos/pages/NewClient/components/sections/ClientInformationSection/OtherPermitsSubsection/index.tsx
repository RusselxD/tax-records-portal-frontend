import { uid } from "../../../../../../../../lib/uid";
import { Plus } from "lucide-react";
import { Button } from "../../../../../../../../components/common";
import type { OtherPermitDetails } from "../../../../../../../../types/client-info";
import OtherPermitEntryForm from "./components/OtherPermitEntryForm";

function emptyOtherPermit(): OtherPermitDetails {
  return {
    _uid: uid(),
    governmentAgency: null,
    registrationNumber: null,
    dateOfRegistration: null,
    dateOfExpiration: null,
  };
}

interface OtherPermitsSubsectionProps {
  data: OtherPermitDetails[];
  onChange: (data: OtherPermitDetails[]) => void;
}

export default function OtherPermitsSubsection({
  data,
  onChange,
}: OtherPermitsSubsectionProps) {
  const updateItem = (index: number, fields: Partial<OtherPermitDetails>) => {
    const updated = data.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onChange(updated);
  };

  const addItem = () => onChange([...data, emptyOtherPermit()]);

  const removeItem = (index: number) =>
    onChange(data.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {data.map((entry, index) => (
        <OtherPermitEntryForm
          key={entry._uid ?? index}
          entry={entry}
          index={index}
          onUpdate={updateItem}
          onRemove={removeItem}
        />
      ))}

      <Button variant="secondary" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add Other Permit
      </Button>
    </div>
  );
}
