import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Trash2 } from "lucide-react";

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
  size?: "sm" | "md";
  className?: string;
  portal?: boolean;
  /** Renders trigger as a plain column header (no border/bg). Use with placeholder as the column name. */
  headerStyle?: boolean;
  /** Renders trigger as ghost — no border, no bg, minimal padding. Use inside card headers. */
  ghost?: boolean;
  /** When provided, each option shows a delete icon on hover. Called with the option's value. */
  onDeleteOption?: (value: string) => void;
}

const HeaderTrigger = ({
  label,
  isOpen,
  isActive,
  onClick,
}: {
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center justify-start gap-1 text-left text-xs font-semibold uppercase tracking-wider transition-colors group ${
      isActive ? "text-accent" : "text-gray-500 hover:text-gray-700"
    }`}
  >
    <span>{label}</span>
    <ChevronDown
      className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
        isActive ? "text-accent" : "text-gray-400 group-hover:text-gray-600"
      }`}
    />
  </button>
);

const FilterTrigger = ({
  label,
  isOpen,
  onClick,
  size = "md",
}: {
  label: string;
  isOpen: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-md border border-gray-300 bg-white text-primary hover:bg-gray-50 transition-colors ${
      size === "sm" ? "px-3 py-2 text-[0.800rem]" : "px-4 py-2.5 text-sm"
    }`}
  >
    <span>{label}</span>
    <ChevronDown
      className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"}`}
    />
  </button>
);

const GhostTrigger = ({
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
    className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
  >
    <span>{label}</span>
    <ChevronDown
      className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
    className={`flex w-full items-center justify-between rounded-md border px-3 py-3 sm:py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 min-w-0 ${
      error
        ? "border-status-rejected focus:border-status-rejected focus:ring-status-rejected"
        : "border-gray-300 focus:border-primary/40 focus:ring-primary/20"
    } ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}
  >
    <span
      className={`truncate min-w-0 ${isPlaceholder ? "text-gray-400" : "text-primary"}`}
    >
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
  size = "md",
  className,
  portal = false,
  headerStyle = false,
  ghost = false,
  onDeleteOption,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});

  const isFormMode = !headerStyle && !ghost && (label !== undefined || placeholder !== undefined || fullWidth);
  const selectedOption = options.find((o) => o.value === value);

  const displayLabel = headerStyle
    ? (value && selectedOption ? selectedOption.label : (placeholder ?? ""))
    : (selectedOption?.label ?? placeholder ?? value);

  const isPlaceholder = !selectedOption && !!placeholder;
  const isActive = headerStyle && !!value;

  useEffect(() => {
    if (isOpen && menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    } else {
      setMenuHeight(0);
    }
  }, [isOpen]);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideContainer = containerRef.current?.contains(target);
      const insideMenu = portal && menuRef.current?.contains(target);
      if (!insideContainer && !insideMenu) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, portal]);

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen && portal && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPortalStyle({
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          width: headerStyle ? 180 : Math.max(rect.width, 140),
          zIndex: 9999,
        });
      }
      setIsOpen(!isOpen);
    }
  };

  const menuEl = (
    <div
      ref={menuRef}
      className={`${portal ? "" : "absolute left-0 top-full mt-1 w-full"} min-w-[140px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg font-normal ${portal ? "" : "z-20"} transition-all duration-200 ${className ?? ""}`}
      style={{
        ...(portal ? portalStyle : {}),
        maxHeight: isOpen ? Math.min(menuHeight, 200) : 0,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      {options.length === 0 ? (
        <div className="px-3 py-2.5 text-sm text-gray-400">No options available</div>
      ) : (
        options.map((option) => (
          <div
            key={option.value}
            className={`flex items-center group ${
              option.value === value
                ? "bg-accent/10"
                : "hover:bg-gray-50"
            }`}
          >
            <button
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`flex-1 min-w-0 text-left px-3 py-2 text-sm transition-colors truncate ${
                option.value === value
                  ? "text-accent font-medium"
                  : "text-gray-700"
              }`}
              title={option.label}
            >
              {option.label}
            </button>
            {onDeleteOption && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteOption(option.value);
                }}
                className="px-2 py-2 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all shrink-0"
                title={`Delete ${option.label}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={isFormMode || headerStyle ? "w-full" : ghost ? "" : ""}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <div className="relative" ref={containerRef}>
        {ghost ? (
          <GhostTrigger
            label={displayLabel}
            isOpen={isOpen}
            onClick={handleToggle}
          />
        ) : headerStyle ? (
          <HeaderTrigger
            label={displayLabel}
            isOpen={isOpen}
            isActive={isActive}
            onClick={handleToggle}
          />
        ) : isFormMode ? (
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
            size={size}
          />
        )}
        {portal ? createPortal(menuEl, document.body) : menuEl}
      </div>
      {error && <p className="mt-1 text-sm text-status-rejected">{error}</p>}
    </div>
  );
}
