import { useState, useRef, useEffect } from "react";
import { formatCurrency } from "../../lib/formatters";

export interface CurrencyInputProps {
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  error?: string;
}

/**
 * A text input that displays formatted currency (e.g. "₱56,465.00") when blurred,
 * and shows the raw number for editing when focused.
 */
export default function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = "₱0.00",
  error,
}: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync display value from prop when not focused
  useEffect(() => {
    if (!focused) {
      setDisplayValue(value != null ? formatCurrency(value) : "");
    }
  }, [value, focused]);

  const handleFocus = () => {
    setFocused(true);
    // Show raw number for editing
    setDisplayValue(value != null ? String(value) : "");
    // Select all text on focus for easy replacement
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const handleBlur = () => {
    setFocused(false);
    // Parse the raw input back to a number
    const raw = displayValue.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(raw);
    if (raw === "" || isNaN(parsed)) {
      onChange(null);
    } else {
      onChange(parsed);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    // Fire onChange on every keystroke so dependent calculations update live
    const stripped = raw.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(stripped);
    onChange(stripped === "" || isNaN(parsed) ? null : parsed);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full rounded-md border px-3 py-2.5 text-sm text-primary placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 ${
          error
            ? "border-status-rejected focus:border-status-rejected focus:ring-status-rejected"
            : "border-gray-300 focus:border-primary/40 focus:ring-primary/20"
        }`}
      />
      {error && <p className="mt-1 text-sm text-status-rejected">{error}</p>}
    </div>
  );
}
