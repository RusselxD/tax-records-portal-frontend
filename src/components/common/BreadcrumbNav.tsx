import { useState } from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  /** If provided, the segment is clickable. Omit for the current/last page. */
  onClick?: () => void;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

/** Collapse middle segments when there are more than this many items */
const VISIBLE_TAIL = 2;
const COLLAPSE_THRESHOLD = 3;

function Separator() {
  return <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />;
}

export default function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const shouldCollapse = !expanded && items.length > COLLAPSE_THRESHOLD;
  const firstItem = items[0];
  const tailItems = shouldCollapse
    ? items.slice(items.length - VISIBLE_TAIL)
    : items.slice(1);
  const tailStartIndex = shouldCollapse ? items.length - VISIBLE_TAIL : 1;
  const hiddenCount = shouldCollapse ? items.length - 1 - VISIBLE_TAIL : 0;

  return (
    <nav className={`flex items-center gap-1.5 text-sm flex-wrap ${className}`}>
      {/* First item — always visible */}
      {firstItem.onClick ? (
        <button
          onClick={firstItem.onClick}
          className="text-gray-400 hover:text-accent transition-colors font-medium shrink-0 truncate max-w-[12rem]"
        >
          {firstItem.label}
        </button>
      ) : (
        <span className="font-medium text-primary truncate">{firstItem.label}</span>
      )}

      {/* Collapsed middle segments */}
      {shouldCollapse && (
        <span className="flex items-center gap-1.5">
          <Separator />
          <button
            onClick={() => setExpanded(true)}
            className="px-1.5 py-0.5 text-gray-400 hover:text-accent hover:bg-gray-100 rounded transition-colors"
            title={`Show ${hiddenCount} more`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </span>
      )}

      {/* Visible tail items (or all items if expanded) */}
      {tailItems.map((item, i) => {
        const actualIndex = tailStartIndex + i;
        const isLast = actualIndex === items.length - 1;
        return (
          <span key={actualIndex} className="flex items-center gap-1.5 min-w-0">
            <Separator />
            {isLast || !item.onClick ? (
              <span className="font-medium text-primary truncate">
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="text-gray-400 hover:text-accent transition-colors font-medium truncate max-w-[12rem]"
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
