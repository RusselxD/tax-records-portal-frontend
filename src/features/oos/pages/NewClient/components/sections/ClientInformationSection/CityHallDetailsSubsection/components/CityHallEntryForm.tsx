import { Trash2 } from "lucide-react";
import { Input } from "../../../../../../../../../components/common";
import type {
  CityHallDetails,
  PermitDetails,
} from "../../../../../../../../../types/client-info";
import DateFieldInput from "../../../DateFieldInput";
import FileUploadInput from "../../../FileUploadInput";

function PermitFields({
  label,
  permit,
  onChange,
}: {
  label: string;
  permit: PermitDetails | null;
  onChange: (permit: PermitDetails | null) => void;
}) {
  const value = permit ?? { number: null, expirationDate: null };

  const updateNumber = (num: string | null) => {
    const updated = { ...value, number: num };
    const isEmpty = !updated.number && !updated.expirationDate;
    onChange(isEmpty ? null : updated);
  };

  const updateExpiration = (exp: PermitDetails["expirationDate"]) => {
    const updated = { ...value, expirationDate: exp };
    const isEmpty = !updated.number && !updated.expirationDate;
    onChange(isEmpty ? null : updated);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        label={`${label} — Number`}
        value={value.number ?? ""}
        onChange={(e) => updateNumber(e.target.value || null)}
        placeholder="Permit number"
      />
      <DateFieldInput
        label={`${label} — Expiration`}
        value={value.expirationDate}
        onChange={updateExpiration}
      />
    </div>
  );
}

interface CityHallEntryFormProps {
  entry: CityHallDetails;
  index: number;
  onUpdate: (index: number, fields: Partial<CityHallDetails>) => void;
  onRemove: (index: number) => void;
}

export default function CityHallEntryForm({
  entry,
  index,
  onUpdate,
  onRemove,
}: CityHallEntryFormProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-primary">
          City Hall #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
          title="Remove entry"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Business Permit City"
            value={entry.businessPermitCity ?? ""}
            onChange={(e) =>
              onUpdate(index, {
                businessPermitCity: e.target.value || null,
              })
            }
            placeholder="City name"
          />
          <Input
            label="Business Permit Number"
            value={entry.businessPermitNumber ?? ""}
            onChange={(e) =>
              onUpdate(index, {
                businessPermitNumber: e.target.value || null,
              })
            }
            placeholder="Permit number"
          />
          <DateFieldInput
            label="Date of Registration"
            value={entry.dateOfRegistration}
            onChange={(v) => onUpdate(index, { dateOfRegistration: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Renewal Basis"
            value={entry.renewalBasis ?? ""}
            onChange={(e) =>
              onUpdate(index, { renewalBasis: e.target.value || null })
            }
            placeholder="e.g. Annual"
          />
          <DateFieldInput
            label="Permit Expiration Date"
            value={entry.permitExpirationDate}
            onChange={(v) =>
              onUpdate(index, { permitExpirationDate: v })
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <DateFieldInput
            label="Quarterly Deadline (Q2)"
            value={entry.quarterlyDeadlineQ2}
            onChange={(v) =>
              onUpdate(index, { quarterlyDeadlineQ2: v })
            }
          />
          <DateFieldInput
            label="Quarterly Deadline (Q3)"
            value={entry.quarterlyDeadlineQ3}
            onChange={(v) =>
              onUpdate(index, { quarterlyDeadlineQ3: v })
            }
          />
          <DateFieldInput
            label="Quarterly Deadline (Q4)"
            value={entry.quarterlyDeadlineQ4}
            onChange={(v) =>
              onUpdate(index, { quarterlyDeadlineQ4: v })
            }
          />
        </div>

        <PermitFields
          label="Fire Permit"
          permit={entry.firePermit}
          onChange={(firePermit) => onUpdate(index, { firePermit })}
        />
        <PermitFields
          label="Sanitary Permit"
          permit={entry.sanitaryPermit}
          onChange={(sanitaryPermit) =>
            onUpdate(index, { sanitaryPermit })
          }
        />
        <PermitFields
          label="Other Permit"
          permit={entry.otherPermit}
          onChange={(otherPermit) => onUpdate(index, { otherPermit })}
        />

        <div className="grid grid-cols-2 gap-4">
          <FileUploadInput
            label="Mayor's Business Permit"
            value={entry.mayorBusinessPermit}
            onChange={(v) => onUpdate(index, { mayorBusinessPermit: v })}
          />
          <FileUploadInput
            label="Business Permit Plate"
            value={entry.businessPermitPlate}
            onChange={(v) => onUpdate(index, { businessPermitPlate: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FileUploadInput
            label="Billing Assessment"
            value={entry.billingAssessment}
            onChange={(v) => onUpdate(index, { billingAssessment: v })}
          />
          <FileUploadInput
            label="Official Receipt of Payment"
            value={entry.officialReceiptOfPayment}
            onChange={(v) => onUpdate(index, { officialReceiptOfPayment: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FileUploadInput
            label="Sanitary Permit"
            value={entry.sanitaryPermitFile}
            onChange={(v) => onUpdate(index, { sanitaryPermitFile: v })}
          />
          <FileUploadInput
            label="Fire Permit"
            value={entry.firePermitFile}
            onChange={(v) => onUpdate(index, { firePermitFile: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FileUploadInput
            label="Barangay Permit"
            value={entry.barangayPermit}
            onChange={(v) => onUpdate(index, { barangayPermit: v })}
          />
          <FileUploadInput
            label="Community Tax Certificate"
            value={entry.communityTaxCertificate}
            onChange={(v) => onUpdate(index, { communityTaxCertificate: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FileUploadInput
            label="Locational Clearance"
            value={entry.locationalClearance}
            onChange={(v) => onUpdate(index, { locationalClearance: v })}
          />
          <FileUploadInput
            label="Environmental Clearance"
            value={entry.environmentalClearance}
            onChange={(v) => onUpdate(index, { environmentalClearance: v })}
          />
        </div>
        <FileUploadInput
          label="Comprehensive General Liability Insurance"
          value={entry.comprehensiveGeneralLiabilityInsurance}
          onChange={(v) => onUpdate(index, { comprehensiveGeneralLiabilityInsurance: v })}
        />
      </div>
    </div>
  );
}
