import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchInput({
  placeholder,
  value,
  onChange,
  className = "w-full sm:w-72",
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-4 py-3 sm:py-2.5 text-sm text-primary placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 focus:border-primary/40 focus:ring-primary/20"
      />
    </div>
  );
}
