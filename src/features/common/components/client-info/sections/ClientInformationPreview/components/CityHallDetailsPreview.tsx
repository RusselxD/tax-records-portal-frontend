import type { CityHallDetails } from "../../../../../../../types/client-info";
import { TextDisplay, DateFieldDisplay, FileDisplay } from "../../../field-displays";

function permitHasData(permit: { number: string | null; expirationDate: { date: string | null; isImportant: boolean } | null } | null): boolean {
  return !!(permit?.number || permit?.expirationDate?.date);
}

function cityHasData(city: CityHallDetails): boolean {
  return !!(
    city.businessPermitCity ||
    city.businessPermitNumber ||
    city.dateOfRegistration?.date ||
    city.renewalBasis ||
    city.permitExpirationDate?.date ||
    city.quarterlyDeadlineQ2?.date ||
    city.quarterlyDeadlineQ3?.date ||
    city.quarterlyDeadlineQ4?.date ||
    permitHasData(city.firePermit) ||
    permitHasData(city.sanitaryPermit) ||
    permitHasData(city.otherPermit) ||
    city.mayorBusinessPermit ||
    city.businessPermitPlate ||
    city.billingAssessment ||
    city.officialReceiptOfPayment ||
    city.sanitaryPermitFile ||
    city.firePermitFile ||
    city.barangayPermit ||
    city.communityTaxCertificate ||
    city.locationalClearance ||
    city.environmentalClearance ||
    city.comprehensiveGeneralLiabilityInsurance
  );
}

function CityHallCard({ data, index }: { data: CityHallDetails; index: number }) {
  if (!cityHasData(data)) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 sm:p-4">
      <span className="text-sm font-semibold text-primary mb-3 block">
        {data.businessPermitCity || `City #${index + 1}`}
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        <TextDisplay label="Business Permit City" value={data.businessPermitCity} />
        <TextDisplay label="Business Permit Number" value={data.businessPermitNumber} />
        <DateFieldDisplay label="Date of Registration" value={data.dateOfRegistration} />
        <TextDisplay label="Renewal Basis" value={data.renewalBasis} />
        <DateFieldDisplay label="Permit Expiration Date" value={data.permitExpirationDate} />
        <DateFieldDisplay label="Quarterly Deadline Q2" value={data.quarterlyDeadlineQ2} />
        <DateFieldDisplay label="Quarterly Deadline Q3" value={data.quarterlyDeadlineQ3} />
        <DateFieldDisplay label="Quarterly Deadline Q4" value={data.quarterlyDeadlineQ4} />

        {permitHasData(data.firePermit) && (
          <>
            <TextDisplay label="Fire Permit Number" value={data.firePermit?.number} />
            <DateFieldDisplay label="Fire Permit Expiration" value={data.firePermit?.expirationDate} />
          </>
        )}

        {permitHasData(data.sanitaryPermit) && (
          <>
            <TextDisplay label="Sanitary Permit Number" value={data.sanitaryPermit?.number} />
            <DateFieldDisplay label="Sanitary Permit Expiration" value={data.sanitaryPermit?.expirationDate} />
          </>
        )}

        {permitHasData(data.otherPermit) && (
          <>
            <TextDisplay label="Other Permit Number" value={data.otherPermit?.number} />
            <DateFieldDisplay label="Other Permit Expiration" value={data.otherPermit?.expirationDate} />
          </>
        )}

        <FileDisplay label="Mayor's Business Permit" value={data.mayorBusinessPermit} />
        <FileDisplay label="Business Permit Plate" value={data.businessPermitPlate} />
        <FileDisplay label="Billing Assessment" value={data.billingAssessment} />
        <FileDisplay label="Official Receipt of Payment" value={data.officialReceiptOfPayment} />
        <FileDisplay label="Sanitary Permit" value={data.sanitaryPermitFile} />
        <FileDisplay label="Fire Permit" value={data.firePermitFile} />
        <FileDisplay label="Barangay Permit" value={data.barangayPermit} />
        <FileDisplay label="Community Tax Certificate" value={data.communityTaxCertificate} />
        <FileDisplay label="Locational Clearance" value={data.locationalClearance} />
        <FileDisplay label="Environmental Clearance" value={data.environmentalClearance} />
        <FileDisplay label="Comprehensive General Liability Insurance" value={data.comprehensiveGeneralLiabilityInsurance} />
      </div>
    </div>
  );
}

export default function CityHallDetailsPreview({ data }: { data: CityHallDetails[] }) {
  const filled = data.filter(cityHasData);
  if (filled.length === 0) return null;

  return (
    <div className="space-y-3">
      {filled.map((city, i) => (
        <CityHallCard key={i} data={city} index={i} />
      ))}
    </div>
  );
}
