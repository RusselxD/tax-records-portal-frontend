import { useState, type ReactNode } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";
import { useIsCompact } from "../../hooks/useMediaQuery";

/* ── Types ─────────────────────────────────────────────── */

export interface CardField {
  label: string;
  value: ReactNode;
}

export interface ResponsiveTableProps<T> {
  /** The data array (used for mobile card-stack rendering) */
  data: T[];
  /** Unique key for each item */
  keyExtractor: (item: T) => string;
  /** Fields always visible on the mobile card */
  primaryFields: (item: T) => CardField[];
  /** Fields shown when the card is expanded (optional) */
  secondaryFields?: (item: T) => CardField[];
  /** Called when a card/row is tapped */
  onItemClick?: (item: T) => void;
  /** Render action buttons for a card (kebab menu or inline) */
  actions?: (item: T) => ReactNode;
  /** Extra classNames on the card (e.g. overdue red border) */
  cardClassName?: (item: T) => string;
  /** Show loading skeletons */
  isLoading?: boolean;
  /** Number of skeleton cards to show */
  loadingCount?: number;
  /** Message when data is empty */
  emptyMessage?: string;
  /** Filters to show above card-stack on mobile (for table-header filters that are hidden) */
  mobileFilters?: ReactNode;
  /** The desktop table — rendered as-is on sm+ */
  children: ReactNode;
}

/* ── Skeleton Card ─────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 w-40 rounded skeleton" />
        <div className="h-5 w-20 rounded skeleton" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 rounded skeleton" />
        <div className="h-4 w-24 rounded skeleton" />
      </div>
    </div>
  );
}

/* ── Mobile Card ───────────────────────────────────────── */

interface MobileCardProps<T> {
  item: T;
  primaryFields: (item: T) => CardField[];
  secondaryFields?: (item: T) => CardField[];
  onItemClick?: (item: T) => void;
  actions?: (item: T) => ReactNode;
  cardClassName?: (item: T) => string;
}

function MobileCard<T>({
  item,
  primaryFields,
  secondaryFields,
  onItemClick,
  actions,
  cardClassName,
}: MobileCardProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const primary = primaryFields(item);
  const secondary = secondaryFields?.(item);
  const hasSecondary = secondary && secondary.length > 0;
  const extraClass = cardClassName?.(item) ?? "";

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${extraClass}`}
      onClick={onItemClick ? () => onItemClick(item) : undefined}
      role={onItemClick ? "button" : undefined}
      tabIndex={onItemClick ? 0 : undefined}
    >
      {/* Primary fields */}
      <div className="p-4 space-y-2">
        {primary.map((field, i) => (
          <div key={i} className={i === 0
            ? "flex items-start justify-between gap-3"
            : "flex items-center justify-between gap-3"
          }>
            {i === 0 ? (
              <>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {field.label}
                  </span>
                  <div className="text-sm font-medium text-primary mt-0.5">
                    {field.value}
                  </div>
                </div>
                {/* Actions in top-right corner of first field row */}
                {actions && (
                  <div
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(item)}
                  </div>
                )}
              </>
            ) : (
              <>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider shrink-0">
                  {field.label}
                </span>
                <div className="text-sm text-gray-700 text-right min-w-0">
                  {field.value}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Expand toggle for secondary fields */}
      {hasSecondary && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            className="w-full flex items-center justify-center gap-1 py-2 border-t border-gray-100 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <span>{expanded ? "Less" : "More details"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
          {expanded && (
            <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
              {secondary!.map((field, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider shrink-0">
                    {field.label}
                  </span>
                  <div className="text-sm text-gray-700 text-right min-w-0">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────── */

export default function ResponsiveTable<T>({
  data,
  keyExtractor,
  primaryFields,
  secondaryFields,
  onItemClick,
  actions,
  cardClassName,
  isLoading,
  loadingCount = 5,
  emptyMessage = "No results found.",
  mobileFilters,
  children,
}: ResponsiveTableProps<T>) {
  const isMobile = useIsCompact();

  if (!isMobile) {
    // Desktop: render the table children inside a horizontal scroll wrapper
    return <div className="overflow-x-auto">{children}</div>;
  }

  // Mobile: card-stack view
  return (
    <div className="space-y-3">
      {mobileFilters && (
        <div className="flex flex-wrap gap-2">{mobileFilters}</div>
      )}

      {isLoading ? (
        Array.from({ length: loadingCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))
      ) : data.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-12 text-center text-sm text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        data.map((item) => (
          <MobileCard
            key={keyExtractor(item)}
            item={item}
            primaryFields={primaryFields}
            secondaryFields={secondaryFields}
            onItemClick={onItemClick}
            actions={actions}
            cardClassName={cardClassName}
          />
        ))
      )}
    </div>
  );
}

/* ── Utility: Kebab Menu for table actions ─────────────── */

interface KebabMenuProps {
  children: ReactNode;
}

export function KebabMenu({ children }: KebabMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
            onClick={() => setOpen(false)}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export function KebabMenuItem({
  onClick,
  children,
  variant = "default",
}: {
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
        variant === "danger"
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
