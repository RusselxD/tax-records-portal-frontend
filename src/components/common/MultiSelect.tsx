import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  disabled = false,
  error,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
            error
              ? "border-status-rejected focus:border-status-rejected focus:ring-status-rejected"
              : "border-gray-300 focus:border-primary/40 focus:ring-primary/20"
          } ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}
        >
          <span className={value.length === 0 ? "text-gray-400" : "text-primary"}>
            {value.length === 0
              ? placeholder
              : `${selectedLabels.length} selected`}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div
          ref={menuRef}
          className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg z-20 transition-all duration-200"
          style={{
            maxHeight: isOpen ? 192 : 0,
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggleOption(option.value)}
                className={`flex w-full items-center gap-2 text-left px-3 py-2 text-sm transition-colors ${
                  isSelected
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    isSelected
                      ? "border-accent bg-accent text-white"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected tags */}
      {selectedLabels.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {value.map((v) => {
            const opt = options.find((o) => o.value === v);
            if (!opt) return null;
            return (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={() => handleRemove(v)}
                  className="hover:text-accent-hover"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-status-rejected">{error}</p>
      )}
    </div>
  );
}
