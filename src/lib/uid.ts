/** Generate a short unique ID for React keys. Frontend-only, not persisted. */
export const uid = () => crypto.randomUUID();

/**
 * Stamp `_uid` on every item in an array that lacks one.
 * Used when hydrating data from the API into forms with dynamic lists.
 */
export function hydrateUids<T extends { _uid?: string }>(items: T[]): T[] {
  return items.map((item) => (item._uid ? item : { ...item, _uid: uid() }));
}
