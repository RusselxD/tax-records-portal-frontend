import type { BirBranchDetails } from "../../../../../../../types/client-info";
import { TextDisplay, DateFieldDisplay, FileDisplay } from "../../../field-displays";

interface BirBranchPreviewProps {
  data: BirBranchDetails;
  label: string;
}

export function branchHasData(branch: BirBranchDetails): boolean {
  return !!(
    branch.businessTradeName ||
    branch.tin ||
    branch.rdo ||
    branch.completeRegisteredAddress ||
    branch.birRegistrationNumber ||
    branch.typeOfBusiness ||
    branch.classification ||
    branch.dateOfBirRegistration?.date ||
    branch.birCertificateOfRegistration ||
    branch.birForm1901 ||
    branch.birForm1921Atp ||
    branch.birForm1905 ||
    branch.sampleInvoiceReceipts ||
    branch.niriPoster ||
    branch.birBookOfAccountsStamp ||
    branch.birForm2000Dst ||
    branch.contractOfLease
  );
}

export default function BirBranchPreview({ data, label }: BirBranchPreviewProps) {
  if (!branchHasData(data)) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 sm:p-4">
      <span className="text-sm font-semibold text-primary mb-3 block">{label}</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        <TextDisplay label="Business / Trade Name" value={data.businessTradeName} />
        <TextDisplay label="TIN" value={data.tin} />
        <TextDisplay label="RDO" value={data.rdo} />
        <TextDisplay label="BIR Registration Number" value={data.birRegistrationNumber} />
        <TextDisplay label="Complete Registered Address" value={data.completeRegisteredAddress} fullWidth />
        <TextDisplay label="Type of Business" value={data.typeOfBusiness} />
        <TextDisplay label="Classification" value={data.classification} />
        <DateFieldDisplay label="Date of BIR Registration" value={data.dateOfBirRegistration} />
        <FileDisplay label="BIR Certificate of Registration" value={data.birCertificateOfRegistration} />
        <FileDisplay label="BIR Form 1901" value={data.birForm1901} />
        <FileDisplay label="BIR Form 1921 ATP" value={data.birForm1921Atp} />
        <FileDisplay label="BIR Form 1905" value={data.birForm1905} />
        <FileDisplay label="Sample Invoice / Receipts" value={data.sampleInvoiceReceipts} />
        <FileDisplay label="NIRI Poster" value={data.niriPoster} />
        <FileDisplay label="BIR Book of Accounts Stamp" value={data.birBookOfAccountsStamp} />
        <FileDisplay label="BIR Form 2000 DST" value={data.birForm2000Dst} />
        <FileDisplay label="Contract of Lease" value={data.contractOfLease} />
      </div>
    </div>
  );
}
