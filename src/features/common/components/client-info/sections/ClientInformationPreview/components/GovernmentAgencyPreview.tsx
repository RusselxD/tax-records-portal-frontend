import type { GovernmentAgencyDetails } from "../../../../../../../types/client-info";
import { TextDisplay, DateFieldDisplay, FileDisplay } from "../../../field-displays";

interface GovernmentAgencyPreviewProps {
  data: GovernmentAgencyDetails;
}

export function agencyHasData(data: GovernmentAgencyDetails): boolean {
  return !!(
    data.dateOfRegistration?.date ||
    data.registrationNumber ||
    data.certificatesAndDocuments ||
    data.others
  );
}

export default function GovernmentAgencyPreview({ data }: GovernmentAgencyPreviewProps) {
  if (!agencyHasData(data)) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      <DateFieldDisplay label="Date of Registration" value={data.dateOfRegistration} />
      <TextDisplay label="Registration Number" value={data.registrationNumber} />
      <FileDisplay label="Certificates & Documents" value={data.certificatesAndDocuments} />
      <TextDisplay label="Others" value={data.others} />
    </div>
  );
}
