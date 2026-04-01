import { useState, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, Loader2, X } from "lucide-react";
import CommentPreview from "./CommentPreview";
import type { RichTextContent } from "../../types/client-info";

interface CommentPopoverProps {
  fetchComment: () => Promise<RichTextContent | null>;
}

const POPOVER_MAX_WIDTH = 320;
const GAP = 6;
const VIEWPORT_PADDING = 8;

export default function CommentPopover({ fetchComment }: CommentPopoverProps) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState<RichTextContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const computePosition = useCallback(() => {
    const btn = buttonRef.current;
    const pop = popoverRef.current;
    if (!btn) return;

    const btnRect = btn.getBoundingClientRect();
    const popHeight = pop?.offsetHeight ?? 200;
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    // Responsive width: fit viewport on small screens
    const popoverWidth = Math.min(POPOVER_MAX_WIDTH, viewportW - VIEWPORT_PADDING * 2);

    // Vertical: prefer below, flip above if not enough space
    const spaceBelow = viewportH - btnRect.bottom - GAP;
    const spaceAbove = btnRect.top - GAP;
    let top: number;

    if (spaceBelow >= popHeight || spaceBelow >= spaceAbove) {
      top = btnRect.bottom + GAP;
    } else {
      top = btnRect.top - GAP - popHeight;
    }

    // Clamp vertical
    top = Math.max(VIEWPORT_PADDING, Math.min(top, viewportH - popHeight - VIEWPORT_PADDING));

    // Horizontal: right-align to button, clamp to viewport
    let left = btnRect.right - popoverWidth;
    if (left < VIEWPORT_PADDING) left = VIEWPORT_PADDING;
    if (left + popoverWidth > viewportW - VIEWPORT_PADDING) {
      left = viewportW - popoverWidth - VIEWPORT_PADDING;
    }

    setStyle({ top, left, width: popoverWidth });
  }, []);

  // Recompute after popover renders (so we have actual height)
  useLayoutEffect(() => {
    if (open && comment) computePosition();
  }, [open, comment, computePosition]);

  const handleClick = useCallback(async () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (comment) {
      setOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetchComment();
      setComment(res);
      setOpen(true);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [open, comment, fetchComment]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current && !popoverRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    const handle = () => computePosition();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [open, computePosition]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className="mt-1.5 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <MessageSquare className="h-3 w-3" />
        )}
        <span>View comment</span>
      </button>

      {open && comment && createPortal(
        <div
          ref={popoverRef}
          className="fixed z-50 rounded-lg border border-gray-200 bg-white shadow-lg"
          style={style}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500">Comment</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="px-3 py-2.5 max-h-60 overflow-y-auto">
            <CommentPreview content={comment} className="text-xs" />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
