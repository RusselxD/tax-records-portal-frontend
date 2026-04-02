import { useState } from "react";
import { Plus, Minus, Pencil, FileText } from "lucide-react";
import { FilePreviewOverlay } from "../../../../../components/common";
import type {
  DiffSection,
  DiffChange,
  DiffFieldChange,
  DiffModifiedChange,
  DiffAddedChange,
  DiffRemovedChange,
} from "../../../../../types/client-profile";


function DiffFileRow({ fileId, fileName, variant }: { fileId: string; fileName: string; variant: "old" | "new" }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const styles = variant === "old"
    ? "border-red-200 bg-red-50/60 hover:bg-red-100/60 hover:border-red-300"
    : "border-green-200 bg-green-50/60 hover:bg-green-100/60 hover:border-green-300";

  return (
    <>
      <div
        onClick={() => setPreviewOpen(true)}
        className={`flex items-center gap-2.5 rounded-md border px-3 py-2 cursor-pointer transition-colors ${styles}`}
      >
        <FileText className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="flex-1 truncate text-sm font-medium text-primary" title={fileName}>
          {fileName}
        </span>
      </div>
      {previewOpen && (
        <FilePreviewOverlay fileId={fileId} fileName={fileName} setModalOpen={setPreviewOpen} />
      )}
    </>
  );
}

function FieldRow({ change }: { change: DiffFieldChange }) {
  return (
    <div className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 px-5 py-3 items-start">
      <span className="text-sm text-gray-500 leading-relaxed">{change.field}</span>
      <div>
        {change.oldFileId && change.old ? (
          <DiffFileRow fileId={change.oldFileId} fileName={change.old} variant="old" />
        ) : (
          <span className="text-sm text-gray-500 bg-red-50 rounded px-2.5 py-1.5 leading-relaxed break-words inline-block">
            {change.old ?? "—"}
          </span>
        )}
      </div>
      <div>
        {change.newFileId && change.new ? (
          <DiffFileRow fileId={change.newFileId} fileName={change.new} variant="new" />
        ) : (
          <span className="text-sm text-primary bg-green-50 rounded px-2.5 py-1.5 leading-relaxed break-words inline-block">
            {change.new ?? "—"}
          </span>
        )}
      </div>
    </div>
  );
}

function ModifiedItem({ change }: { change: DiffModifiedChange }) {
  return (
    <>
      <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50/50 border-t border-gray-100">
        <Pencil className="w-3 h-3 text-amber-500" />
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
          Modified
        </span>
        <span className="text-sm font-medium text-primary">{change.itemLabel}</span>
      </div>
      {change.fields.map((f, i) => (
        <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 px-5 py-2.5 pl-10 items-start">
          <span className="text-sm text-gray-500 leading-relaxed">{f.field}</span>
          <div>
            {f.oldFileId && f.old ? (
              <DiffFileRow fileId={f.oldFileId} fileName={f.old} variant="old" />
            ) : (
              <span className="text-sm text-gray-500 bg-red-50 rounded px-2.5 py-1.5 leading-relaxed break-words inline-block">
                {f.old}
              </span>
            )}
          </div>
          <div>
            {f.newFileId && f.new ? (
              <DiffFileRow fileId={f.newFileId} fileName={f.new} variant="new" />
            ) : (
              <span className="text-sm text-primary bg-green-50 rounded px-2.5 py-1.5 leading-relaxed break-words inline-block">
                {f.new}
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

function AddedItem({ change }: { change: DiffAddedChange }) {
  return (
    <>
      <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50/50 border-t border-gray-100">
        <Plus className="w-3 h-3 text-green-600" />
        <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
          Added
        </span>
        <span className="text-sm font-medium text-primary">{change.itemLabel}</span>
      </div>
      {change.fields.map((f, i) => (
        <div key={i} className="grid grid-cols-[2fr_3fr] gap-4 px-5 py-2.5 pl-10 items-start">
          <span className="text-sm text-gray-500 leading-relaxed">{f.field}</span>
          <div>
            {f.newFileId && f.value ? (
              <DiffFileRow fileId={f.newFileId} fileName={f.value} variant="new" />
            ) : (
              <span className="text-sm text-primary bg-green-50 rounded px-2.5 py-1.5 leading-relaxed break-words inline-block">
                {f.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

function RemovedItem({ change }: { change: DiffRemovedChange }) {
  return (
    <div className="flex items-center gap-2 px-5 py-3 bg-red-50/50 border-t border-gray-100">
      <Minus className="w-3 h-3 text-red-500" />
      <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
        Removed
      </span>
      <span className="text-sm font-medium text-gray-500 line-through">{change.itemLabel}</span>
    </div>
  );
}

function ChangeRow({ change }: { change: DiffChange }) {
  switch (change.type) {
    case "field":
      return <FieldRow change={change} />;
    case "modified":
      return <ModifiedItem change={change} />;
    case "added":
      return <AddedItem change={change} />;
    case "removed":
      return <RemovedItem change={change} />;
  }
}

export default function SectionDiffCard({ section }: { section: DiffSection }) {
  if (section.changes.length === 0) return null;

  const hasFieldColumns = section.changes.some(
    (c) => c.type === "field" || c.type === "modified",
  );

  return (
    <div className="rounded-lg bg-white border border-gray-200 custom-shadow">
      <div className="px-5 py-3.5 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-primary">{section.sectionLabel}</h3>
      </div>

      {hasFieldColumns && (
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 px-5 py-2.5 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Field</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Current</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Proposed</span>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {section.changes.map((change, i) => (
          <ChangeRow key={i} change={change} />
        ))}
      </div>
    </div>
  );
}
