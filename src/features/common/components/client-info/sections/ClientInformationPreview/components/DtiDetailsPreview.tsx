import type { DtiDetails } from "../../../../../../../types/client-info";
import { TextDisplay, DateFieldDisplay, FileDisplay } from "../../../field-displays";
import SubsectionHeading from "../../SubsectionHeading";

export function hasDtiData(data: DtiDetails): boolean {
  return !!(
    data.dtiRegistrationNo ||
    data.dtiDateOfRegistration?.date ||
    data.dtiDateOfExpiration?.date ||
    data.dtiBusinessRegistrationCertificate ||
    data.dtiBnrsUndertakingForm ||
    data.dtiOfficialReceipt ||
    data.bmbeTotalAssets ||
    data.bmbeNo ||
    data.bmbeDateOfRegistration?.date ||
    data.bmbeDateOfExpiration?.date ||
    data.bmbeOfficialReceipt ||
    data.others
  );
}

export default function DtiDetailsPreview({ data }: { data: DtiDetails }) {
  const hasDti = !!(
    data.dtiRegistrationNo ||
    data.dtiDateOfRegistration?.date ||
    data.dtiDateOfExpiration?.date ||
    data.dtiBusinessRegistrationCertificate ||
    data.dtiBnrsUndertakingForm ||
    data.dtiOfficialReceipt
  );

  const hasBmbe = !!(
    data.bmbeTotalAssets ||
    data.bmbeNo ||
    data.bmbeDateOfRegistration?.date ||
    data.bmbeDateOfExpiration?.date ||
    data.bmbeOfficialReceipt
  );

  if (!hasDti && !hasBmbe && !data.others) return null;

  return (
    <div className="space-y-5">
      {hasDti && (
        <>
          <SubsectionHeading label="DTI Registration" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <TextDisplay label="DTI Registration No." value={data.dtiRegistrationNo} />
            <DateFieldDisplay label="Date of Registration" value={data.dtiDateOfRegistration} />
            <DateFieldDisplay label="Date of Expiration" value={data.dtiDateOfExpiration} />
            <FileDisplay label="Business Registration Certificate" value={data.dtiBusinessRegistrationCertificate} />
            <FileDisplay label="BNRS Undertaking Form" value={data.dtiBnrsUndertakingForm} />
            <FileDisplay label="Official Receipt" value={data.dtiOfficialReceipt} />
          </div>
        </>
      )}

      {hasBmbe && (
        <>
          <SubsectionHeading label="BMBE Compliance" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <TextDisplay label="Total Assets" value={data.bmbeTotalAssets} />
            <TextDisplay label="BMBE No." value={data.bmbeNo} />
            <DateFieldDisplay label="Date of Registration" value={data.bmbeDateOfRegistration} />
            <DateFieldDisplay label="Date of Expiration" value={data.bmbeDateOfExpiration} />
            <FileDisplay label="Official Receipt" value={data.bmbeOfficialReceipt} />
          </div>
        </>
      )}

      <TextDisplay label="Others" value={data.others} />
    </div>
  );
}
