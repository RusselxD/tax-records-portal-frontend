export interface FieldChange {
  label: string;
  oldValue: string;
  newValue: string;
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

function isDateField(val: unknown): val is { date: string | null; isImportant: boolean } {
  return isPlainObject(val) && "date" in val && "isImportant" in val;
}

function isFileRef(val: unknown): val is { id: string; name: string } {
  return isPlainObject(val) && "id" in val && "name" in val && !("date" in val) && !("type" in val);
}

function isRichText(val: unknown): val is { type: "doc" } {
  return isPlainObject(val) && "type" in val && (val as Record<string, unknown>).type === "doc";
}

function isLinkRef(val: unknown): val is { url: string; label: string } {
  return isPlainObject(val) && "url" in val && "label" in val;
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "string") return val || "—";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (isDateField(val)) {
    const d = val.date || "—";
    return val.isImportant ? `${d} (important)` : d;
  }
  if (isFileRef(val)) return val.name || "—";
  if (isLinkRef(val)) return val.url || "—";
  if (isRichText(val)) return "[Rich text content]";
  if (Array.isArray(val)) return `${val.length} item${val.length !== 1 ? "s" : ""}`;
  return "—";
}

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

// Keys to skip in diff comparison (internal/computed)
const SKIP_KEYS = new Set(["id"]);

export function extractChanges(
  current: Record<string, unknown>,
  submitted: Record<string, unknown>,
  parentLabel = "",
): FieldChange[] {
  const changes: FieldChange[] = [];
  const allKeys = [...new Set([...Object.keys(current), ...Object.keys(submitted)])];

  for (const key of allKeys) {
    if (SKIP_KEYS.has(key)) continue;

    const curVal = current[key];
    const subVal = submitted[key];
    const label = parentLabel ? `${parentLabel} › ${humanize(key)}` : humanize(key);

    if (JSON.stringify(curVal) === JSON.stringify(subVal)) continue;

    // Special object types — compare as leaf values
    if ((isDateField(curVal) || isDateField(subVal))
      || (isFileRef(curVal) || isFileRef(subVal))
      || (isLinkRef(curVal) || isLinkRef(subVal))) {
      changes.push({ label, oldValue: formatValue(curVal), newValue: formatValue(subVal) });
      continue;
    }

    if (isRichText(curVal) || isRichText(subVal)) {
      changes.push({ label, oldValue: "[Rich text]", newValue: "[Modified]" });
      continue;
    }

    // Both plain objects — recurse
    if (isPlainObject(curVal) && isPlainObject(subVal)) {
      changes.push(...extractChanges(curVal, subVal, label));
      continue;
    }

    // Arrays
    if (Array.isArray(curVal) || Array.isArray(subVal)) {
      const curArr = (curVal as unknown[]) || [];
      const subArr = (subVal as unknown[]) || [];
      const maxLen = Math.max(curArr.length, subArr.length);

      // Array of objects — compare element by element
      if (curArr.some(isPlainObject) || subArr.some(isPlainObject)) {
        for (let i = 0; i < maxLen; i++) {
          const curItem = curArr[i] as Record<string, unknown> | undefined;
          const subItem = subArr[i] as Record<string, unknown> | undefined;
          const itemLabel = `${label} #${i + 1}`;

          if (!curItem && subItem) {
            changes.push({ label: itemLabel, oldValue: "—", newValue: "Added" });
          } else if (curItem && !subItem) {
            changes.push({ label: itemLabel, oldValue: "Removed", newValue: "—" });
          } else if (curItem && subItem && JSON.stringify(curItem) !== JSON.stringify(subItem)) {
            changes.push(...extractChanges(curItem, subItem, itemLabel));
          }
        }
      } else {
        changes.push({ label, oldValue: formatValue(curVal), newValue: formatValue(subVal) });
      }
      continue;
    }

    // Primitives
    changes.push({ label, oldValue: formatValue(curVal), newValue: formatValue(subVal) });
  }

  return changes;
}
