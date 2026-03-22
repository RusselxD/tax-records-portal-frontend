import { Plus, Minus, Pencil } from "lucide-react";
import type {
  DiffSection,
  DiffChange,
  DiffFieldChange,
  DiffModifiedChange,
  DiffAddedChange,
  DiffRemovedChange,
} from "../../../../../types/client-profile";

const CARD_SHADOW = "0 1px 6px rgba(0,0,0,0.08)";

function FieldRow({ change }: { change: DiffFieldChange }) {
  return (
    <div className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 px-5 py-3 items-start">
      <span className="text-sm text-gray-500 leading-relaxed">{change.field}</span>
      <span className="text-sm text-gray-500 bg-red-50 rounded px-2.5 py-1.5 leading-relaxed break-words">
        {change.old ?? "—"}
      </span>
      <span className="text-sm text-primary bg-green-50 rounded px-2.5 py-1.5 leading-relaxed break-words">
        {change.new ?? "—"}
      </span>
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
          <span className="text-sm text-gray-500 bg-red-50 rounded px-2.5 py-1.5 leading-relaxed break-words">
            {f.old}
          </span>
          <span className="text-sm text-primary bg-green-50 rounded px-2.5 py-1.5 leading-relaxed break-words">
            {f.new}
          </span>
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
          <span className="text-sm text-primary bg-green-50 rounded px-2.5 py-1.5 leading-relaxed break-words">
            {f.value}
          </span>
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
    <div className="rounded-lg bg-white border border-gray-200" style={{ boxShadow: CARD_SHADOW }}>
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
