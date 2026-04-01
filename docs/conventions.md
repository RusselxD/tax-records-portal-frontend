# Code Conventions

Reference checklist for frontend code conventions and patterns.

---

## Component Structure

- **Size cap**: ~250 lines per file.
- **Folder promotion**: When a component exceeds ~250 lines, convert to a folder: `ComponentName/index.tsx` + `components/` subdirectory.
- **Barrel exports**: Page folders use `index.ts` (not `.tsx`) as barrel, actual component in `ComponentName.tsx`.
- **Composition**: Pages delegate to small sub-components -- don't build monolith pages.

---

## Component Rules

- **Always use `Dropdown` component** -- never use native `<select>` elements (`src/components/common/Dropdown.tsx`).
- **Always use `UserAvatar` component** -- never define avatar rendering inline.
- **Always use `getInitials()`** from `src/lib/formatters.ts` -- never define inline.
- **Always use `StatusBadge` wrappers** -- `ClientStatusBadge`, `AccountStatus`, `InvoiceStatusBadge` are thin wrappers around the generic `StatusBadge`.

---

## Constants Over Strings

Always use constant objects for comparisons -- never raw string literals:

```typescript
// Good
if (task.status === TAX_RECORD_TASK_STATUS.OPEN) { ... }
if (client.status === CLIENT_STATUS.ACTIVE_CLIENT) { ... }
if (user.status === USER_STATUS.ACTIVE) { ... }

// Bad
if (task.status === "OPEN") { ... }
if (client.status === "ACTIVE_CLIENT") { ... }
```

Constants are defined in `src/constants/` and `src/types/`.

---

## Context Pattern

Every feature context must follow these three rules:

```typescript
// 1. Provider value wrapped in useMemo
const value = useMemo(() => ({ ... }), [deps]);

// 2. Callbacks wrapped in useCallback
const fetchData = useCallback(async () => { ... }, [deps]);

// 3. Data-fetching useEffect with cancelled flag + cleanup
useEffect(() => {
  let cancelled = false;
  async function fetch() {
    const data = await api.getData();
    if (cancelled) return;
    setData(data);
  }
  fetch();
  return () => { cancelled = true; };
}, [deps]);
```

---

## Styling

Tailwind CSS only -- no CSS modules, no styled-components, no inline style objects. CSS variables live in `src/styles/global.css`.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Navy | `#031731` | Sidebar bg, primary text |
| Gold | `#d0a865` | Accent color, active nav bg |

### Key Classes

| Element | Classes |
|---|---|
| Page background | `bg-gray-50` |
| Card | `bg-white border border-gray-200 rounded-lg` |
| Section title | `text-sm font-semibold text-primary` |
| Metadata label | `text-xs font-medium text-gray-400 uppercase tracking-wider` |
| Sidebar | `bg-sidebar-bg` with `text-white/70`, `hover:bg-white/10` |
| Active nav item | `bg-accent text-primary` |

### Rules

- **Accent on dark bg**: use `text-primary` not `text-white` (WCAG compliance -- white on gold fails ~2:1, navy on gold passes ~9:1).
- **Minimum text size**: `text-sm` for card content -- `text-xs` is too small for body content.
- **Text wrapping**: don't truncate -- let text wrap with `leading-relaxed`.

---

## Modal Pattern

Modals accept two props:

```typescript
interface ModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}
```

- `setModalOpen` -- state dispatcher to close the modal.
- `onSuccess` -- callback after successful action.

---

## API Layer

- One module per domain in `src/api/`.
- All modules use the shared Axios instance from `axios-config.ts`.
- Use `buildParams()` from `src/api/api-utils.ts` for building filter query params.

---

## Error Handling

- Use `getErrorMessage(err)` from `src/lib/api-error.ts` in all catch blocks.
- Use `isRateLimitedError(err)` for auth flow 429 handling (login, forgot/reset password, activate account, change password).
- Backend error format: `{ message: string, errors?: Record<string, string> }`.

```typescript
import { getErrorMessage } from "@/lib/api-error";

try {
  await api.doSomething();
} catch (err) {
  const message = getErrorMessage(err);
  showToast({ type: "error", message });
}
```

---

## Shared Utilities

Key functions in `src/lib/formatters.ts`:

| Function | Purpose |
|---|---|
| `getInitials(name)` | Avatar initials |
| `resolveAssetUrl(path)` | Prepends `VITE_API_BASE_URL` for `<img src>` |
| `formatDate(date)` | Consistent date formatting |
| `formatCurrency(amount)` | Currency formatting |

---

## File Validation

`src/lib/file-validation.ts` -- wired into all upload points.

| Category | Max Size | Allowed Types |
|---|---|---|
| Documents | 25MB | PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, JPEG, PNG, GIF, WEBP, DAT |
| Rich text images | 10MB | JPG, JPEG, PNG, GIF, WEBP |

---

## Rich Text

TipTap/ProseMirror JSON format is used throughout.

| Component | Purpose |
|---|---|
| `RichTextEditor` | Client info sections (tied to `NewClientContext`) |
| `CommentEditor` / `CommentPreview` | Comments (standalone, uses generic image upload) |

Shared extensions: `src/components/common/tiptap-extensions.ts`.

---

## SECTIONS Constant

`src/types/client-info.ts` -- single source of truth for 7 section keys + labels. Also exports `SECTION_KEYS`. Re-exported from context files. Never define section labels or keys inline.
