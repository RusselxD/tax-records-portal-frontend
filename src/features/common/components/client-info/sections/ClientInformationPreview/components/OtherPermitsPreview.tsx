import type { OtherPermitDetails } from "../../../../../../../types/client-info";
import { TextDisplay, DateFieldDisplay } from "../../../field-displays";

function permitHasData(p: OtherPermitDetails): boolean {
  return !!(
    p.governmentAgency ||
    p.registrationNumber ||
    p.dateOfRegistration?.date ||
    p.dateOfRegistration?.notApplicable ||
    p.dateOfExpiration?.date ||
    p.dateOfExpiration?.notApplicable
  );
}

function OtherPermitCard({ data, index }: { data: OtherPermitDetails; index: number }) {
  if (!permitHasData(data)) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 sm:p-4">
      <span className="text-sm font-semibold text-primary mb-3 block">
        {data.governmentAgency || `Other Permit #${index + 1}`}
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        <TextDisplay label="Government Agency" value={data.governmentAgency} />
        <TextDisplay label="Registration Number" value={data.registrationNumber} />
        <DateFieldDisplay label="Date of Registration" value={data.dateOfRegistration} />
        <DateFieldDisplay label="Date of Expiration" value={data.dateOfExpiration} />
      </div>
    </div>
  );
}

export default function OtherPermitsPreview({ data }: { data: OtherPermitDetails[] }) {
  const filled = data.filter(permitHasData);
  if (filled.length === 0) return null;

  return (
    <div className="space-y-3">
      {filled.map((p, i) => (
        <OtherPermitCard key={i} data={p} index={i} />
      ))}
    </div>
  );
}
