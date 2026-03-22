import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { UserTitle } from "../../types/user";

interface Props {
  titles: UserTitle[];
  onChange: (titles: UserTitle[]) => void;
}

export default function TitlesEditor({ titles, onChange }: Props) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...titles, { title: trimmed, prefix: false }]);
    setInput("");
  };

  const remove = (i: number) => {
    onChange(titles.filter((_, idx) => idx !== i));
  };

  const togglePrefix = (i: number) => {
    onChange(titles.map((t, idx) => (idx === i ? { ...t, prefix: !t.prefix } : t)));
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
              onClick={() => togglePrefix(i)}
              className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:border-gray-400 transition-colors w-16 text-center shrink-0"
            >
              {t.prefix ? "Prefix" : "Suffix"}
            </button>
            <span className="text-sm text-gray-700 flex-1">{t.title}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            placeholder="e.g. CPA, Atty."
            className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-primary/40 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={add}
            className="p-1.5 rounded-md border border-gray-300 text-gray-500 hover:border-gray-400 hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
