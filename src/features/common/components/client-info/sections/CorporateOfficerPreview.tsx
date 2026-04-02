import type {
  CorporateOfficerInformation,
  CorporateOfficerDetails,
  PointOfContactDetails,
} from "../../../../../types/client-info";
import { CollapsibleSubsection } from "../../../../../components/common";
import { TextDisplay, DateFieldDisplay, FileDisplay } from "../field-displays";

function officerHasData(officer: CorporateOfficerDetails): boolean {
  return !!(
    officer.name ||
    officer.position ||
    officer.birthday?.date ||
    officer.address ||
    officer.idScannedWith3Signature
  );
}

function OfficerCard({ officer, index }: { officer: CorporateOfficerDetails; index: number }) {
  if (!officerHasData(officer)) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 sm:p-4">
      <span className="text-sm font-semibold text-primary mb-3 block">
        Officer #{index + 1}
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        <TextDisplay label="Full Name" value={officer.name} />
        <TextDisplay label="Position" value={officer.position} />
        <DateFieldDisplay label="Birthday" value={officer.birthday} />
        <TextDisplay label="Address" value={officer.address} />
        <FileDisplay label="ID Scanned with 3 Specimen Signatures" value={officer.idScannedWith3Signature} />
      </div>
    </div>
  );
}

function contactHasData(poc: PointOfContactDetails): boolean {
  return !!(
    poc.contactPerson ||
    poc.contactNumber ||
    poc.deliveryAddress ||
    poc.landmarkPinLocation ||
    poc.emailAddress ||
    poc.preferredMethodOfCommunication ||
    poc.alternativeContact
  );
}

function PointOfContactCard({ data }: { data: PointOfContactDetails }) {
  if (!contactHasData(data)) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      <TextDisplay label="Contact Person" value={data.contactPerson} />
      <TextDisplay label="Contact Number" value={data.contactNumber} />
      <TextDisplay label="Delivery Address" value={data.deliveryAddress} fullWidth />
      <TextDisplay label="Landmark / Pin Location" value={data.landmarkPinLocation} />
      <TextDisplay label="Email Address" value={data.emailAddress} />
      <TextDisplay label="Preferred Method of Communication" value={data.preferredMethodOfCommunication} />
      <TextDisplay label="Alternative Contact" value={data.alternativeContact} />
    </div>
  );
}

export default function CorporateOfficerPreview({ data }: { data: CorporateOfficerInformation }) {
  const hasOfficers = data.officers.some(officerHasData);
  const hasContact = contactHasData(data.pointOfContact);

  if (!hasOfficers && !hasContact) return null;

  return (
    <div className="space-y-3">
      {hasOfficers && (
        <CollapsibleSubsection title="Owner's or Corporate Officer's">
          <div className="space-y-3">
            {data.officers.map((officer, i) => (
              <OfficerCard key={i} officer={officer} index={i} />
            ))}
          </div>
        </CollapsibleSubsection>
      )}

      {hasContact && (
        <CollapsibleSubsection title="Point of Contact Details">
          <PointOfContactCard data={data.pointOfContact} />
        </CollapsibleSubsection>
      )}
    </div>
  );
}
