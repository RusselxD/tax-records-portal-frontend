import type { SecDetails } from "../../../../../../../types/client-info";
import { TextDisplay, DateFieldDisplay, FileDisplay } from "../../../field-displays";

export function hasSecData(data: SecDetails): boolean {
  return !!(
    data.dateOfIncorporation?.date ||
    data.secRegistrationNumber ||
    data.dateOfActualMeetingPerBylaws?.date ||
    data.primaryPurposePerArticles ||
    data.corporationCategory ||
    data.secCertificateOfIncorporation ||
    data.articlesOfIncorporation ||
    data.bylawsOfCorporation ||
    data.certificateOfAuthentication ||
    data.authorizeFilerSecretaryCertificate ||
    data.secOfficialReceipts ||
    data.latestGisOrAppointmentOfOfficer ||
    data.stockAndTransferBook ||
    data.boardResolutionsSecretaryCertificate ||
    data.previousYearAfsAndItr ||
    data.others
  );
}

export default function SecDetailsPreview({ data }: { data: SecDetails }) {
  const hasData = !!(
    data.dateOfIncorporation?.date ||
    data.secRegistrationNumber ||
    data.dateOfActualMeetingPerBylaws?.date ||
    data.primaryPurposePerArticles ||
    data.corporationCategory ||
    data.secCertificateOfIncorporation ||
    data.articlesOfIncorporation ||
    data.bylawsOfCorporation ||
    data.certificateOfAuthentication ||
    data.authorizeFilerSecretaryCertificate ||
    data.secOfficialReceipts ||
    data.latestGisOrAppointmentOfOfficer ||
    data.stockAndTransferBook ||
    data.boardResolutionsSecretaryCertificate ||
    data.previousYearAfsAndItr ||
    data.others
  );

  if (!hasData) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      <DateFieldDisplay label="Date of Incorporation" value={data.dateOfIncorporation} />
      <TextDisplay label="SEC Registration Number" value={data.secRegistrationNumber} />
      <DateFieldDisplay label="Date of Actual Meeting per Bylaws" value={data.dateOfActualMeetingPerBylaws} />
      <TextDisplay label="Corporation Category" value={data.corporationCategory} />
      <TextDisplay label="Primary Purpose per Articles" value={data.primaryPurposePerArticles} fullWidth />
      <FileDisplay label="SEC Certificate of Incorporation" value={data.secCertificateOfIncorporation} />
      <FileDisplay label="Articles of Incorporation" value={data.articlesOfIncorporation} />
      <FileDisplay label="Bylaws of Corporation" value={data.bylawsOfCorporation} />
      <FileDisplay label="Certificate of Authentication" value={data.certificateOfAuthentication} />
      <FileDisplay label="Authorize Filer Secretary Certificate" value={data.authorizeFilerSecretaryCertificate} />
      <FileDisplay label="SEC Official Receipts" value={data.secOfficialReceipts} />
      <FileDisplay label="Latest GIS / Appointment of Officer" value={data.latestGisOrAppointmentOfOfficer} />
      <FileDisplay label="Stock & Transfer Book" value={data.stockAndTransferBook} />
      <FileDisplay label="Board Resolutions / Secretary Certificate" value={data.boardResolutionsSecretaryCertificate} />
      <FileDisplay label="Previous Year AFS & ITR" value={data.previousYearAfsAndItr} />
      <TextDisplay label="Others" value={data.others} fullWidth />
    </div>
  );
}
