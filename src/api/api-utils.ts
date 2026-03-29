/**
 * Builds a params Record from a filters object, skipping null/undefined/empty-string values.
 * For `page` and `size`, null is skipped but 0 is kept.
 *
 * Accepts any interface whose values are primitive filter types.
 */
export function buildParams<
  T extends { [K in keyof T]: string | number | boolean | null | undefined },
>(filters: T): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(filters)) {
    if (val == null || val === "") continue;
    params[key] = typeof val === "number" ? val : String(val);
  }
  return params;
}
