import { X } from "lucide-react";
import { Input, Dropdown } from "../../../../../../../components/common";
import type { UserTitle } from "../../../../../../../types/user";

const prefixOptions = [
  { label: "Before name", value: "prefix" },
  { label: "After name", value: "suffix" },
];

interface TitleEntryProps {
  title: UserTitle;
  onUpdate: (updated: UserTitle) => void;
  onRemove: () => void;
}

export default function TitleEntry({ title, onUpdate, onRemove }: TitleEntryProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        id={`title-${title.title}`}
        value={title.title}
        onChange={(e) => onUpdate({ ...title, title: e.target.value })}
        placeholder="e.g. CPA, MBA"
      />
      <div className="shrink-0">
        <Dropdown
          options={prefixOptions}
          value={title.prefix ? "prefix" : "suffix"}
          onChange={(val) => onUpdate({ ...title, prefix: val === "prefix" })}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 text-gray-400 hover:text-status-rejected transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
