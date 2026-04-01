import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function generatePageNumbers(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const pages: (number | "...")[] = [0];
  if (current > 2) pages.push("...");

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) pages.push("...");
  pages.push(total - 1);

  return pages;
}

export default function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Showing {start}–{end} of {totalElements}
      </p>
      <div className="flex items-center gap-1">
        {/* Prev button — larger touch target on mobile */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-2 sm:p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers — hidden on mobile, show simplified on sm, full on md+ */}
        <div className="hidden sm:flex items-center gap-1">
          {generatePageNumbers(page, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`min-w-[32px] h-8 rounded-md text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-accent text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {(p as number) + 1}
              </button>
            ),
          )}
        </div>

        {/* Mobile: show current page / total */}
        <span className="sm:hidden text-sm text-gray-600 px-2">
          {page + 1} / {totalPages}
        </span>

        {/* Next button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-2 sm:p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
