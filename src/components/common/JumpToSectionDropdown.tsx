import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { InfoSectionMeta, InfoSectionKey } from "../../types/client-info";

interface JumpToSectionDropdownProps {
  sections: InfoSectionMeta[];
  onSelect: (key: InfoSectionKey) => void;
}

export default function JumpToSectionDropdown({
  sections,
  onSelect,
}: JumpToSectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-primary hover:bg-gray-50 transition-colors"
      >
        Jump to section
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 bottom-full mb-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg z-30 py-1">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => {
                onSelect(section.key);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {section.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
