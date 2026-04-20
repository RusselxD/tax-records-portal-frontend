import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmActionModal from "../../../../../../../components/common/ConfirmActionModal";
import OverrideTaxRecordModal from "./OverrideTaxRecordModal";
import { taxRecordAPI } from "../../../../../../../api/tax-record";
import { useToast } from "../../../../../../../contexts/ToastContext";
import type { TaxRecordEntryResponse } from "../../../../../../../types/tax-record";

interface Props {
  record: TaxRecordEntryResponse;
  onEdited: () => void;
  onDeleted: () => void;
}

export default function OverrideActions({ record, onEdited, onDeleted }: Props) {
  const { toastSuccess } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setEditOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-accent border border-gray-200 hover:border-accent rounded-md px-3 py-1.5 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-md px-3 py-1.5 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      {editOpen && (
        <OverrideTaxRecordModal
          record={record}
          setModalOpen={setEditOpen}
          onSuccess={onEdited}
        />
      )}

      {deleteOpen && (
        <ConfirmActionModal
          setModalOpen={setDeleteOpen}
          title="Delete Tax Record"
          description={
            <>
              This will permanently delete this tax record and its files. This action cannot be undone.
            </>
          }
          confirmLabel="Delete"
          loadingLabel="Deleting..."
          confirmClassName="bg-red-600 hover:bg-red-700"
          onConfirm={async () => {
            await taxRecordAPI.deleteEntry(record.id);
          }}
          onSuccess={() => {
            toastSuccess("Tax record deleted.");
            onDeleted();
          }}
        />
      )}
    </>
  );
}
