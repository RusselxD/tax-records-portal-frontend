import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export default function BackButton({ label, onClick, className = "" }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
