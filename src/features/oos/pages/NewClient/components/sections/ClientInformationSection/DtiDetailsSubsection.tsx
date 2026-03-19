import { Input } from "../../../../../../../components/common";
import type { DtiDetails } from "../../../../../../../types/client-info";
import DateFieldInput from "../DateFieldInput";
import FileUploadInput from "../FileUploadInput";

interface DtiDetailsSubsectionProps {
  data: DtiDetails;
  onChange: (data: DtiDetails) => void;
}

export default function DtiDetailsSubsection({
  data,
  onChange,
}: DtiDetailsSubsectionProps) {
  const update = (fields: Partial<DtiDetails>) =>
    onChange({ ...data, ...fields });

  return (
    <div className="space-y-6">
      {/* DTI Registration */}
      <div>
        <h4 className="text-sm font-medium text-primary mb-3">
          DTI Registration
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="DTI Registration No."
              value={data.dtiRegistrationNo ?? ""}
              onChange={(e) =>
                update({ dtiRegistrationNo: e.target.value || null })
              }
              placeholder="Enter registration no."
            />
            <DateFieldInput
              label="Date of Registration"
              value={data.dtiDateOfRegistration}
              onChange={(v) => update({ dtiDateOfRegistration: v })}
            />
            <DateFieldInput
              label="Date of Expiration"
              value={data.dtiDateOfExpiration}
              onChange={(v) => update({ dtiDateOfExpiration: v })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FileUploadInput
              label="Business Registration Certificate"
              value={data.dtiBusinessRegistrationCertificate}
              onChange={(v) => update({ dtiBusinessRegistrationCertificate: v })}
            />
            <FileUploadInput
              label="BNRS Undertaking Form"
              value={data.dtiBnrsUndertakingForm}
              onChange={(v) => update({ dtiBnrsUndertakingForm: v })}
            />
            <FileUploadInput
              label="Official Receipt"
              value={data.dtiOfficialReceipt}
              onChange={(v) => update({ dtiOfficialReceipt: v })}
            />
          </div>
        </div>
      </div>

      {/* BMBE Compliance */}
      <div>
        <h4 className="text-sm font-medium text-primary mb-3">
          BMBE Compliance
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Assets"
              value={data.bmbeTotalAssets ?? ""}
              onChange={(e) =>
                update({ bmbeTotalAssets: e.target.value || null })
              }
              placeholder="Enter total assets"
            />
            <Input
              label="BMBE No."
              value={data.bmbeNo ?? ""}
              onChange={(e) => update({ bmbeNo: e.target.value || null })}
              placeholder="Enter BMBE no."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DateFieldInput
              label="Date of Registration"
              value={data.bmbeDateOfRegistration}
              onChange={(v) => update({ bmbeDateOfRegistration: v })}
            />
            <DateFieldInput
              label="Date of Expiration"
              value={data.bmbeDateOfExpiration}
              onChange={(v) => update({ bmbeDateOfExpiration: v })}
            />
          </div>
          <FileUploadInput
            label="BMBE Official Receipt"
            value={data.bmbeOfficialReceipt}
            onChange={(v) => update({ bmbeOfficialReceipt: v })}
          />
        </div>
      </div>

      {/* Others */}
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
