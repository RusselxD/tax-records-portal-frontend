import { Trash2 } from "lucide-react";
import { Input } from "../../../../../../../components/common";
import type { BirBranchDetails } from "../../../../../../../types/client-info";
import DateFieldInput from "../DateFieldInput";
import FileUploadInput from "../FileUploadInput";

interface BirDetailsSubsectionProps {
  mainBranch: BirBranchDetails;
  branches: BirBranchDetails[];
  onMainBranchChange: (data: BirBranchDetails) => void;
  onBranchesChange: (data: BirBranchDetails[]) => void;
}

function BranchForm({
  entry,
  onChange,
}: {
  entry: BirBranchDetails;
  onChange: (fields: Partial<BirBranchDetails>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Business / Trade Name"
          value={entry.businessTradeName ?? ""}
          onChange={(e) =>
            onChange({ businessTradeName: e.target.value || null })
          }
          placeholder="Enter business / trade name"
        />
        <Input
          label="TIN"
          value={entry.tin ?? ""}
          onChange={(e) => onChange({ tin: e.target.value || null })}
          placeholder="e.g. 123-456-789-000"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="RDO"
          value={entry.rdo ?? ""}
          onChange={(e) => onChange({ rdo: e.target.value || null })}
          placeholder="Revenue District Office"
        />
        <Input
          label="BIR Registration Number"
          value={entry.birRegistrationNumber ?? ""}
          onChange={(e) =>
            onChange({ birRegistrationNumber: e.target.value || null })
          }
          placeholder="Enter BIR reg. number"
        />
      </div>

      <Input
        label="Complete Registered Address"
        value={entry.completeRegisteredAddress ?? ""}
        onChange={(e) =>
          onChange({ completeRegisteredAddress: e.target.value || null })
        }
        placeholder="Full registered address"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="Type of Business"
          value={entry.typeOfBusiness ?? ""}
          onChange={(e) => onChange({ typeOfBusiness: e.target.value || null })}
          placeholder="e.g. Services"
        />
        <Input
          label="Classification"
          value={entry.classification ?? ""}
          onChange={(e) => onChange({ classification: e.target.value || null })}
          placeholder="e.g. Non-VAT"
        />
        <DateFieldInput
          label="Date of BIR Registration"
          value={entry.dateOfBirRegistration}
          onChange={(v) => onChange({ dateOfBirRegistration: v })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadInput
          label="BIR Certificate of Registration"
          value={entry.birCertificateOfRegistration}
          onChange={(v) => onChange({ birCertificateOfRegistration: v })}
        />
        <FileUploadInput
          label="BIR Form 1901"
          value={entry.birForm1901}
          onChange={(v) => onChange({ birForm1901: v })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadInput
          label="BIR Form 1921 / ATP"
          value={entry.birForm1921Atp}
          onChange={(v) => onChange({ birForm1921Atp: v })}
        />
        <FileUploadInput
          label="BIR Form 1905"
          value={entry.birForm1905}
          onChange={(v) => onChange({ birForm1905: v })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadInput
          label="Sample Invoice / Receipts"
          value={entry.sampleInvoiceReceipts}
          onChange={(v) => onChange({ sampleInvoiceReceipts: v })}
        />
        <FileUploadInput
          label="NIRI Poster"
          value={entry.niriPoster}
          onChange={(v) => onChange({ niriPoster: v })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUploadInput
          label="BIR Book of Accounts Stamp"
          value={entry.birBookOfAccountsStamp}
          onChange={(v) => onChange({ birBookOfAccountsStamp: v })}
        />
        <FileUploadInput
          label="BIR Form 2000 DST"
          value={entry.birForm2000Dst}
          onChange={(v) => onChange({ birForm2000Dst: v })}
        />
      </div>
      <FileUploadInput
        label="Contract of Lease"
        value={entry.contractOfLease}
        onChange={(v) => onChange({ contractOfLease: v })}
      />
    </div>
  );
}

export default function BirDetailsSubsection({
  mainBranch,
  branches,
  onMainBranchChange,
  onBranchesChange,
}: BirDetailsSubsectionProps) {
  const updateBranch = (index: number, fields: Partial<BirBranchDetails>) => {
    const updated = branches.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onBranchesChange(updated);
  };

  const removeBranch = (index: number) =>
    onBranchesChange(branches.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {/* Main / Head Office — always visible, not removable */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
        <div className="mb-4">
          <span className="text-sm font-semibold text-primary">
            Main / Head Office
          </span>
        </div>
        <BranchForm
          entry={mainBranch}
          onChange={(fields) => onMainBranchChange({ ...mainBranch, ...fields })}
        />
      </div>

      {/* Additional Branches */}
      {branches.map((entry, index) => (
        <div
          key={entry._uid ?? index}
          className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-primary">
              Branch #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeBranch(index)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
              title="Remove branch"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <BranchForm
            entry={entry}
            onChange={(fields) => updateBranch(index, fields)}
          />
        </div>
      ))}
    </div>
  );
}
