import type { ChangedSection } from "../../../../../types/client-profile";
import { SECTIONS } from "../../../../../types/client-info";
import { extractChanges, extractFields } from "./diff-utils";

const SECTION_LABELS: Record<string, string> = Object.fromEntries(
  SECTIONS.map((s) => [s.key, s.label]),
);

export default function SectionDiffCard({ change }: { change: ChangedSection }) {
  const label = SECTION_LABELS[change.sectionKey] ?? change.sectionKey;
  const isDiff = change.current !== null;

  if (isDiff) {
    const changes = extractChanges(change.current!, change.submitted);
    if (changes.length === 0) return null;

    return (
      <div className="rounded-lg bg-white border border-gray-200" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-primary">{label}</h3>
        </div>

        <div className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 px-5 py-2.5 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Field</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Current</span>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Proposed</span>
        </div>

        <div className="divide-y divide-gray-50">
          {changes.map((field, i) => (
            <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr] gap-4 px-5 py-3 items-start">
              <span className="text-sm text-gray-500 leading-relaxed">{field.label}</span>
              <span className="text-sm text-gray-500 bg-red-50 rounded px-2.5 py-1.5 leading-relaxed break-words">
                {field.oldValue}
              </span>
              <span className="text-sm text-primary bg-green-50 rounded px-2.5 py-1.5 leading-relaxed break-words">
                {field.newValue}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Approved view — no current data, show submitted fields only
  const fields = extractFields(change.submitted);
  if (fields.length === 0) return null;

  return (
    <div className="rounded-lg bg-white border border-gray-200" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
      <div className="px-5 py-3.5 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-primary">{label}</h3>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-2.5 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Field</span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Value</span>
      </div>

      <div className="divide-y divide-gray-50">
        {fields.map((field, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 items-start">
            <span className="text-sm text-gray-500 leading-relaxed">{field.label}</span>
            <span className="text-sm text-primary leading-relaxed break-words">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
