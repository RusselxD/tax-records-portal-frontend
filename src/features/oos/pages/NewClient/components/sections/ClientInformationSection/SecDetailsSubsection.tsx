import { Input } from "../../../../../../../components/common";
import type { SecDetails } from "../../../../../../../types/client-info";
import DateFieldInput from "../DateFieldInput";
import FileUploadInput from "../FileUploadInput";

interface SecDetailsSubsectionProps {
  data: SecDetails;
  onChange: (data: SecDetails) => void;
}

export default function SecDetailsSubsection({
  data,
  onChange,
}: SecDetailsSubsectionProps) {
  const update = (fields: Partial<SecDetails>) =>
    onChange({ ...data, ...fields });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <DateFieldInput
          label="Date of Incorporation"
          value={data.dateOfIncorporation}
          onChange={(v) => update({ dateOfIncorporation: v })}
        />
        <Input
          label="SEC Registration Number"
          value={data.secRegistrationNumber ?? ""}
          onChange={(e) =>
            update({ secRegistrationNumber: e.target.value || null })
          }
          placeholder="Enter SEC registration no."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DateFieldInput
          label="Date of Actual Meeting per Bylaws"
          value={data.dateOfActualMeetingPerBylaws}
          onChange={(v) => update({ dateOfActualMeetingPerBylaws: v })}
        />
        <Input
          label="Corporation Category"
          value={data.corporationCategory ?? ""}
          onChange={(e) =>
            update({ corporationCategory: e.target.value || null })
          }
          placeholder="Enter corporation category"
        />
      </div>

      <Input
        label="Primary Purpose per Articles"
        value={data.primaryPurposePerArticles ?? ""}
        onChange={(e) =>
          update({ primaryPurposePerArticles: e.target.value || null })
        }
        placeholder="Enter primary purpose"
      />

      <div className="grid grid-cols-2 gap-4">
        <FileUploadInput
          label="SEC Certificate of Incorporation"
          value={data.secCertificateOfIncorporation}
          onChange={(v) => update({ secCertificateOfIncorporation: v })}
        />
        <FileUploadInput
          label="Articles of Incorporation"
          value={data.articlesOfIncorporation}
          onChange={(v) => update({ articlesOfIncorporation: v })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FileUploadInput
          label="Bylaws of Corporation"
          value={data.bylawsOfCorporation}
          onChange={(v) => update({ bylawsOfCorporation: v })}
        />
        <FileUploadInput
          label="Certificate of Authentication"
          value={data.certificateOfAuthentication}
          onChange={(v) => update({ certificateOfAuthentication: v })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FileUploadInput
          label="Authorize Filer / Secretary Certificate"
          value={data.authorizeFilerSecretaryCertificate}
          onChange={(v) => update({ authorizeFilerSecretaryCertificate: v })}
        />
        <FileUploadInput
          label="SEC Official Receipts"
          value={data.secOfficialReceipts}
          onChange={(v) => update({ secOfficialReceipts: v })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FileUploadInput
          label="Latest GIS / Appointment of Officer"
          value={data.latestGisOrAppointmentOfOfficer}
          onChange={(v) => update({ latestGisOrAppointmentOfOfficer: v })}
        />
        <FileUploadInput
          label="Stock & Transfer Book"
          value={data.stockAndTransferBook}
          onChange={(v) => update({ stockAndTransferBook: v })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FileUploadInput
          label="Board Resolutions / Secretary Certificate"
          value={data.boardResolutionsSecretaryCertificate}
          onChange={(v) => update({ boardResolutionsSecretaryCertificate: v })}
        />
        <FileUploadInput
          label="Previous Year AFS & ITR"
          value={data.previousYearAfsAndItr}
          onChange={(v) => update({ previousYearAfsAndItr: v })}
        />
      </div>

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
