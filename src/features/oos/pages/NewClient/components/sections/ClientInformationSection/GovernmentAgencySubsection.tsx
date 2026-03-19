import { Input } from "../../../../../../../components/common";
import type { GovernmentAgencyDetails } from "../../../../../../../types/client-info";
import DateFieldInput from "../DateFieldInput";
import FileUploadInput from "../FileUploadInput";

interface GovernmentAgencySubsectionProps {
  data: GovernmentAgencyDetails;
  onChange: (data: GovernmentAgencyDetails) => void;
}

export default function GovernmentAgencySubsection({
  data,
  onChange,
}: GovernmentAgencySubsectionProps) {
  const update = (fields: Partial<GovernmentAgencyDetails>) =>
    onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <DateFieldInput
          label="Date of Registration"
          value={data.dateOfRegistration}
          onChange={(v) => update({ dateOfRegistration: v })}
        />
        <Input
          label="Registration Number"
          value={data.registrationNumber ?? ""}
          onChange={(e) =>
            update({ registrationNumber: e.target.value || null })
          }
          placeholder="Enter registration number"
        />
      </div>

      <FileUploadInput
        label="Certificates & Documents"
        value={data.certificatesAndDocuments}
        onChange={(v) => update({ certificatesAndDocuments: v })}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-primary">
          Others
        </label>
        <textarea
          value={data.others ?? ""}
          onChange={(e) => update({ others: e.target.value || null })}
          placeholder="Additional notes..."
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-primary placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 focus:border-primary/40 focus:ring-primary/20 resize-none"
        />
      </div>
    </div>
  );
}
