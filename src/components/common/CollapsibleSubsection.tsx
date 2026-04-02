import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSubsectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSubsection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSubsectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 sm:px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-primary">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "" : "-rotate-90"}`}
        />
      </button>
      {isOpen && (
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          {children}
        </div>
      )}
    </div>
  );
}
