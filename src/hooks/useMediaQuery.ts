import { useState, useEffect } from "react";

/**
 * Returns true when the given media query matches.
 * Uses window.matchMedia for efficient, event-driven updates.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** True when viewport is below the sm breakpoint (640px) */
export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 640px)");
}

/** True when viewport is below the md breakpoint (768px) — used by ResponsiveTable */
export function useIsCompact(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}
