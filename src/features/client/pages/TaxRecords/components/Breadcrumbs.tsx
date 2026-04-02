import { Home } from "lucide-react";
import BreadcrumbNav from "../../../../../components/common/BreadcrumbNav";
import type { BreadcrumbItem } from "../../../../../components/common/BreadcrumbNav";
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

  const items: BreadcrumbItem[] = [
    { label: "All Records", onClick: () => onNavigate(0) },
    ...selections.map((sel, i) => ({
      label: sel.label,
      ...(i < selections.length - 1 ? { onClick: () => onNavigate(i + 1) } : {}),
    })),
  ];

  return <BreadcrumbNav items={items} className="mb-5" />;
}
