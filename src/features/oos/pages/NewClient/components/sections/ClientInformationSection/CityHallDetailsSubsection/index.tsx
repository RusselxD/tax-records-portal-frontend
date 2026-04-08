import { uid } from "../../../../../../../../lib/uid";
import { Plus } from "lucide-react";
import { Button } from "../../../../../../../../components/common";
import type { CityHallDetails } from "../../../../../../../../types/client-info";
import CityHallEntryForm from "./components/CityHallEntryForm";

function emptyCityHall(): CityHallDetails {
  return {
    _uid: uid(),
    businessPermitCity: null,
    businessPermitNumber: null,
    dateOfRegistration: null,
    renewalBasis: null,
    quarterlyDeadlineQ2: null,
    quarterlyDeadlineQ3: null,
    quarterlyDeadlineQ4: null,
    permitExpirationDate: null,
    firePermit: null,
    sanitaryPermit: null,
    otherPermit: null,
    mayorBusinessPermit: [],
    businessPermitPlate: [],
    billingAssessment: [],
    officialReceiptOfPayment: [],
    sanitaryPermitFile: [],
    firePermitFile: [],
    barangayPermit: [],
    communityTaxCertificate: [],
    locationalClearance: [],
    environmentalClearance: [],
    comprehensiveGeneralLiabilityInsurance: [],
  };
}

interface CityHallDetailsSubsectionProps {
  data: CityHallDetails[];
  onChange: (data: CityHallDetails[]) => void;
}

export default function CityHallDetailsSubsection({
  data,
  onChange,
}: CityHallDetailsSubsectionProps) {
  const updateItem = (index: number, fields: Partial<CityHallDetails>) => {
    const updated = data.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onChange(updated);
  };

  const addItem = () => onChange([...data, emptyCityHall()]);

  const removeItem = (index: number) =>
    onChange(data.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {data.map((entry, index) => (
        <CityHallEntryForm
          key={entry._uid ?? index}
          entry={entry}
          index={index}
          onUpdate={updateItem}
          onRemove={removeItem}
        />
      ))}

      <Button variant="secondary" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add City Hall Entry
      </Button>
    </div>
  );
}
