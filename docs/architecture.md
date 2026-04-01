# Architecture

## Folder Structure

```
src/
├── api/          — Axios-based API client modules, one per domain
├── assets/       — Static images, logos
├── components/   — Shared UI components
│   ├── common/   — Reusable primitives (Button, Input, Card, Modal, Dropdown, etc.)
│   └── layout/   — Layout components, createRoleLayout factory
├── constants/    — roles.ts, permissions.ts, status enums
├── contexts/     — Global providers (Auth, Toast, Notifications)
├── features/     — Feature modules by role
│   ├── manager/  — Manager-only pages
│   ├── oos/      — OOS pages (onboarding, offboarding)
│   ├── csd/      — CSD pages
│   ├── qtd/      — QTD pages
│   ├── internal-billing/ — Billing pages
│   ├── client/   — Client portal pages
│   ├── common/   — Pages shared across multiple roles
│   └── shared/   — Shared feature components
├── guards/       — AuthGuard, RoleGuard
├── hooks/        — Shared hooks
├── lib/          — Utility functions
├── pages/        — Standalone pages (ErrorPage)
├── router/       — Route definitions per role
├── types/        — TypeScript interfaces/types
└── styles/       — Global CSS, Tailwind CSS variables
```

## Feature Module Pattern

Each feature page follows this structure:

```
PageName/
├── index.tsx          — Main component (or index.ts barrel if folder)
├── context/           — Page-scoped context provider
├── components/        — Sub-components
└── hooks/             — Page-scoped hooks (if needed)
```

Component size cap: ~250 lines. When exceeded, promote to folder with sub-components.

## State Management

No Redux or external state library. Three tiers:

1. **Global contexts** -- AuthContext (user/auth state), ToastContext (notifications), NotificationsContext (unread count)
2. **Feature contexts** -- Page-scoped providers wrapping route components. Each fetches its own data.
3. **Local state** -- useState/useRef within components

Context rules:

- Provider value must be wrapped in `useMemo`
- Callbacks exposed via context must use `useCallback`
- Data-fetching `useEffect`s must use a `cancelled` flag + cleanup return
- No prop drilling past 2 levels -- extract to context

## Routing

React Router 7 with per-role route files:

- `src/router.tsx` -- top-level, wraps all routes with AuthGuard
- `src/router/authRoutes.tsx` -- login, forgot password, activate account
- `src/router/managerRoutes.tsx`, `csdRoutes.tsx`, `oosRoutes.tsx`, `qtdRoutes.tsx`, `billingRoutes.tsx`, `clientRoutes.tsx`

Each role router wraps pages in the role's layout component.
`RoleGuard` restricts routes to specific roleKeys.
`AuthGuard` ensures authentication.

## Layout System

`createRoleLayout(config)` factory in `src/components/layout/createRoleLayout.tsx`:

- Takes nav items, page titles, and role config
- Returns a layout component with sidebar + topnav + content area
- 5 internal role layouts use this factory; Client layout is separate

## API Layer

`src/api/` -- one module per domain (auth, users, client, tax-record-task, invoice, etc.)

- All use a shared Axios instance from `axios-config.ts`
- Axios interceptors handle token injection and refresh
- `api-utils.ts` provides `buildParams()` for filter-to-query-param building

## Error Handling

- `getErrorMessage(err)` from `src/lib/api-error.ts` -- standard catch-block handler
- `isRateLimitedError(err)` -- 429 detection for auth flows
- `isNotFoundError(err)`, `isConflictError(err)` -- status-specific handling
- Backend error format: `{ message: string, errors?: Record<string, string> }`

## File Handling

- `src/lib/file-validation.ts` -- validates type + size before upload
- Document uploads: 25MB max, PDF/DOC/DOCX/XLS/XLSX/CSV/JPG/PNG/GIF/WEBP/DAT
- Image uploads (rich text): 10MB max, JPG/PNG/GIF/WEBP
- File preview: PDF via react-pdf, DOCX via docx-preview, images native

## Styling

- Tailwind CSS only (no CSS modules, no styled-components)
- CSS variables in `src/styles/global.css`
- Color palette: Navy (#031731) + Gold (#d0a865)
- Dark sidebar, gold accents, white content cards on gray-50 background
