import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
}

const FilterTrigger = ({
  label,
  isOpen,
  onClick,
}: {
  label: string;
  isOpen: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-primary hover:bg-gray-50 transition-colors"
  >
    <span>{label}</span>
    <ChevronDown
      className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    />
  </button>
);

const FormTrigger = ({
  label,
  isOpen,
  isPlaceholder,
  disabled,
  error,
  onClick,
}: {
  label: string;
  isOpen: boolean;
  isPlaceholder: boolean;
  disabled?: boolean;
  error?: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
      error
        ? "border-status-rejected focus:border-status-rejected focus:ring-status-rejected"
        : "border-gray-300 focus:border-primary/40 focus:ring-primary/20"
    } ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}
  >
    <span className={`truncate ${isPlaceholder ? "text-gray-400" : "text-primary"}`}>
      {label}
    </span>
    <ChevronDown
      className={`w-3.5 h-3.5 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    />
  </button>
);

export default function Dropdown({
  options,
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  error,
  fullWidth = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  const isFormMode = label !== undefined || placeholder !== undefined || fullWidth;
  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder ?? value;
  const isPlaceholder = !selectedOption && !!placeholder;

  useEffect(() => {
    if (isOpen && menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    } else {
      setMenuHeight(0);
    }
  }, [isOpen]);

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

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  return (
    <div className={isFormMode ? "w-full" : ""}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <div className="relative" ref={containerRef}>
        {isFormMode ? (
          <FormTrigger
            label={displayLabel}
            isOpen={isOpen}
            isPlaceholder={isPlaceholder}
            disabled={disabled}
            error={error}
            onClick={handleToggle}
          />
        ) : (
          <FilterTrigger
            label={displayLabel}
            isOpen={isOpen}
            onClick={handleToggle}
          />
        )}
        <div
          ref={menuRef}
          className="absolute left-0 mt-1 w-full min-w-[140px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg z-20 transition-all duration-200"
          style={{
            maxHeight: isOpen ? Math.min(menuHeight, 200) : 0,
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                option.value === value
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-status-rejected">{error}</p>
      )}
    </div>
  );
}
