import { useTaxRecordTaskDetails } from "../../context/TaxRecordTaskDetailsContext";
import { TAX_RECORD_TASK_STATUS } from "../../../../../../types/tax-record-task";
import WorkingFilesSection from "./WorkingFilesSection";
import SingleFileSlot from "./SingleFileSlot";

export default function TaskFiles() {
  const {
    task,
    files,
    canEdit,
    canEditProof,
    uploadOutputFile,
    deleteOutputFile,
    uploadProofOfFiling,
    deleteProofOfFiling,
  } = useTaxRecordTaskDetails();

  const status = task?.status;

  // Proof of filing visible from APPROVED_FOR_FILING onwards
  const showProofOfFiling =
    status === TAX_RECORD_TASK_STATUS.APPROVED_FOR_FILING ||
    status === TAX_RECORD_TASK_STATUS.FILED ||
    status === TAX_RECORD_TASK_STATUS.COMPLETED;

  return (
    <div className="rounded-lg bg-white border border-gray-200 p-5 space-y-6">
      <h2 className="text-sm font-semibold text-primary">Files</h2>

      <WorkingFilesSection />

      <div className="border-t border-gray-100 pt-5">
        <SingleFileSlot
          label="Output File / Tax Return"
          file={files?.outputFile ?? null}
          canEdit={canEdit}
          onUpload={uploadOutputFile}
          onDelete={deleteOutputFile}
        />
      </div>

      {showProofOfFiling && (
        <div className="border-t border-gray-100 pt-5">
          <SingleFileSlot
            label="Proof of Filing"
            file={files?.proofOfFilingFile ?? null}
            canEdit={canEditProof}
            onUpload={uploadProofOfFiling}
            onDelete={deleteProofOfFiling}
          />
        </div>
      )}
    </div>
  );
}
