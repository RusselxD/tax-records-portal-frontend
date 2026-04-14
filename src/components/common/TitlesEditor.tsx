import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import type { UserTitle } from "../../types/user";

interface Props {
  titles: UserTitle[];
  onChange: (titles: UserTitle[]) => void;
}

export default function TitlesEditor({ titles, onChange }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    if (focusIndex == null) return;
    inputRefs.current[focusIndex]?.focus();
    setFocusIndex(null);
  }, [focusIndex]);

  const addRow = () => {
    onChange([...titles, { title: "", prefix: false }]);
    setFocusIndex(titles.length);
  };

  const updateRow = (i: number, patch: Partial<UserTitle>) => {
    onChange(titles.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  };

  const remove = (i: number) => {
    onChange(titles.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
        Titles
      </p>

      <div className="flex flex-col gap-1.5">
        {titles.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateRow(i, { prefix: !t.prefix })}
              className="text-xs px-2 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:border-gray-400 transition-colors w-16 text-center shrink-0 leading-5"
            >
              {t.prefix ? "Prefix" : "Suffix"}
            </button>
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              value={t.title}
              onChange={(e) => updateRow(i, { title: e.target.value })}
              placeholder="e.g. CPA, Atty."
              className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-primary/40 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors w-fit mt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add title
        </button>
      </div>
    </div>
  );
}
