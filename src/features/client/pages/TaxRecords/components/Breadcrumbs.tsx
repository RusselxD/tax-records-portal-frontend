import { ChevronRight, Home } from "lucide-react";
import type { DrillSelection } from "../../../../../types/tax-record";

interface BreadcrumbsProps {
  selections: DrillSelection[];
  onNavigate: (index: number) => void;
}

export default function Breadcrumbs({ selections, onNavigate }: BreadcrumbsProps) {
  if (selections.length === 0) {
    return (
      <div className="flex items-center gap-1 text-sm mb-5 font-medium text-primary">
        <Home className="h-3.5 w-3.5" />
        <span>All Records</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm mb-5 flex-wrap">
      <button
        onClick={() => onNavigate(0)}
        className="flex items-center gap-1 text-gray-400 hover:text-accent transition-colors font-medium"
      >
        <Home className="h-3.5 w-3.5" />
        <span>All Records</span>
      </button>

      {selections.map((sel, i) => {
        const isLast = i === selections.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            {isLast ? (
              <span className="font-medium text-primary">{sel.label}</span>
            ) : (
              <button
                onClick={() => onNavigate(i + 1)}
                className="text-gray-400 hover:text-accent transition-colors font-medium"
              >
                {sel.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
