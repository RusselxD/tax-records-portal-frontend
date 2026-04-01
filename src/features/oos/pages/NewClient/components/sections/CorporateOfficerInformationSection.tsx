import { uid } from "../../../../../../lib/uid";
import { Plus, Trash2 } from "lucide-react";
import { Input, Button, CollapsibleSubsection } from "../../../../../../components/common";
import type {
  CorporateOfficerInformation,
  CorporateOfficerDetails,
  PointOfContactDetails,
} from "../../../../../../types/client-info";
import DateFieldInput from "./DateFieldInput";
import FileUploadInput from "./FileUploadInput";

interface CorporateOfficerInformationSectionProps {
  data: CorporateOfficerInformation;
  onChange: (data: CorporateOfficerInformation) => void;
}

function emptyOfficer(): CorporateOfficerDetails {
  return {
    _uid: uid(),
    name: null,
    birthday: null,
    address: null,
    position: null,
    idScannedWith3Signature: null,
  };
}

function OfficersList({
  officers,
  onChange,
}: {
  officers: CorporateOfficerDetails[];
  onChange: (officers: CorporateOfficerDetails[]) => void;
}) {
  const updateItem = (
    index: number,
    fields: Partial<CorporateOfficerDetails>,
  ) => {
    const updated = officers.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onChange(updated);
  };

  const addItem = () => onChange([...officers, emptyOfficer()]);

  const removeItem = (index: number) =>
    onChange(officers.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {officers.map((entry, index) => (
        <div
          key={entry._uid ?? index}
          className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-primary">
              Officer #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
              title="Remove officer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={entry.name ?? ""}
                onChange={(e) =>
                  updateItem(index, { name: e.target.value || null })
                }
                placeholder="Enter full name"
              />
              <Input
                label="Position"
                value={entry.position ?? ""}
                onChange={(e) =>
                  updateItem(index, { position: e.target.value || null })
                }
                placeholder="e.g. President, Treasurer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateFieldInput
                label="Birthday"
                value={entry.birthday}
                onChange={(v) => updateItem(index, { birthday: v })}
              />
              <Input
                label="Address"
                value={entry.address ?? ""}
                onChange={(e) =>
                  updateItem(index, { address: e.target.value || null })
                }
                placeholder="Complete address"
              />
            </div>

            <FileUploadInput
              label="ID Scanned with 3 Specimen Signatures"
              value={entry.idScannedWith3Signature}
              onChange={(v) => updateItem(index, { idScannedWith3Signature: v })}
            />
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add Officer
      </Button>
    </div>
  );
}

function PointOfContactForm({
  data,
  onChange,
}: {
  data: PointOfContactDetails;
  onChange: (data: PointOfContactDetails) => void;
}) {
  const update = (fields: Partial<PointOfContactDetails>) =>
    onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Contact Person"
          value={data.contactPerson ?? ""}
          onChange={(e) => update({ contactPerson: e.target.value || null })}
          placeholder="Full name"
        />
        <Input
          label="Contact Number"
          value={data.contactNumber ?? ""}
          onChange={(e) => update({ contactNumber: e.target.value || null })}
          placeholder="e.g. +63 917 123 4567"
        />
      </div>

      <Input
        label="Delivery Address"
        value={data.deliveryAddress ?? ""}
        onChange={(e) => update({ deliveryAddress: e.target.value || null })}
        placeholder="Full delivery address"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Landmark / Pin Location"
          value={data.landmarkPinLocation ?? ""}
          onChange={(e) =>
            update({ landmarkPinLocation: e.target.value || null })
          }
          placeholder="Nearby landmark or Google Maps pin"
        />
        <Input
          label="Email Address"
          type="email"
          value={data.emailAddress ?? ""}
          onChange={(e) => update({ emailAddress: e.target.value || null })}
          placeholder="email@example.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Preferred Method of Communication"
          value={data.preferredMethodOfCommunication ?? ""}
          onChange={(e) =>
            update({ preferredMethodOfCommunication: e.target.value || null })
          }
          placeholder="e.g. Viber, Email, Phone"
        />
        <Input
          label="Alternative Contact"
          value={data.alternativeContact ?? ""}
          onChange={(e) =>
            update({ alternativeContact: e.target.value || null })
          }
          placeholder="Alternative contact info"
        />
      </div>
    </div>
  );
}

export default function CorporateOfficerInformationSection({
  data,
  onChange,
}: CorporateOfficerInformationSectionProps) {
  return (
    <div className="space-y-3">
      <CollapsibleSubsection title="Owner's or Corporate Officer's">
        <OfficersList
          officers={data.officers}
          onChange={(officers) => onChange({ ...data, officers })}
        />
      </CollapsibleSubsection>

      <CollapsibleSubsection title="Point of Contact Details">
        <PointOfContactForm
          data={data.pointOfContact}
          onChange={(pointOfContact) => onChange({ ...data, pointOfContact })}
        />
      </CollapsibleSubsection>
    </div>
  );
}
