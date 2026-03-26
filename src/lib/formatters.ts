export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Resolves a potentially relative API path to a full URL.
 * If the URL already starts with http/https, returns it as-is.
 */
export function resolveAssetUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${import.meta.env.VITE_API_BASE_URL}${url}`;
}

export function deriveClientDisplayName(
  registeredName: string | null | undefined,
  tradeName: string | null | undefined,
): string {
  const registered = registeredName?.trim() || "";
  const trade = tradeName?.trim() || "";
  if (!registered && !trade) return "";
  if (!registered) return trade;
  if (!trade || trade === registered) return registered;
  return `${registered} (${trade})`;
}

export const formatNum = (n: number | null | undefined) =>
  n != null ? n.toLocaleString() : "—";

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}