<h1 align="center">Tax Records Portal -- Frontend</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Pages" />
</p>

---

## Overview

Internal web portal for Upturn Business Solutions PH. Manages client onboarding and offboarding, tax record task workflows, invoicing, consultation logging, and performance analytics across seven user roles:

- **Manager** -- full administrative control
- **Onboarding, Offboarding & Support (OOS)** -- client setup and support
- **Quality, Training & Development (QTD)** -- profile review and quality assurance
- **Client Service Delivery (CSD)** -- day-to-day client servicing
- **Internal Accounting / Billing** -- invoicing and payment tracking
- **Viewer** -- shared read-only stakeholder account (clients, tax records, consultations)
- **Client** -- self-service portal access

Built with React 19, TypeScript, and Vite. Styled with Tailwind CSS. Deployed on Cloudflare Pages.

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript 5.9 | UI framework |
| Vite 7 | Build tool and dev server |
| Tailwind CSS 3 | Utility-first styling |
| React Router 7 | Client-side routing |
| Axios | HTTP client |
| TipTap | Rich text editing |
| Recharts | Charts and analytics |
| Lucide React | Icon library |
| react-pdf + docx-preview | File previews (PDF, DOCX) |
| xlsx | Bulk import parsing |
| Cloudflare Pages | Deployment |

## Prerequisites

- Node.js 18+
- npm
- Backend API running (default: `http://localhost:8080`)

## Getting Started

```bash
git clone <repository-url>
cd tax-records-portal-frontend
npm install
```

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8080
```

Start the development server:

```bash
npm run dev
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | TypeScript check + Vite production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Build and preview locally |

## Project Structure

```
src/
  api/            API client modules (axios-based)
  assets/         Static assets (images, logos)
  components/     Shared/common UI components
  constants/      Role keys, permissions, status enums
  contexts/       Global contexts (Auth, Toast, Notifications)
  features/       Feature modules by role (manager, oos, qtd, csd,
                    internal-billing, client, common, shared)
  guards/         Route guards (AuthGuard, RoleGuard)
  hooks/          Shared hooks (usePaginatedFetch, useDebounce, useAsyncAction)
  lib/            Utilities (formatters, api-error, token-storage, file-validation)
  pages/          Standalone pages (ErrorPage)
  router/         Route definitions per role
  types/          TypeScript type definitions
  styles/         Global CSS and Tailwind config
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |

## Documentation

Detailed documentation is available in [`docs/`](docs/):

**Core**

- [Architecture](docs/architecture.md) -- App structure, patterns, state management
- [Authentication](docs/authentication.md) -- JWT flow, guards, token refresh
- [Roles & Permissions](docs/roles-and-permissions.md) -- 7 roles, 35 permissions, route access
- [Client Lifecycle](docs/client-lifecycle.md) -- Onboarding, Active, Offboarding, Inactive
- [Task Workflow](docs/task-workflow.md) -- Tax record task statuses, files, review cycle
- [Code Conventions](docs/conventions.md) -- Component patterns, styling, naming rules
- [API Contracts](docs/api-contracts.md) -- Key endpoints, request/response shapes

**Features**

- [Dashboard](docs/features/dashboard.md)
- [Client Info](docs/features/client-info.md)
- [Billing](docs/features/billing.md)
- [Consultation Hours](docs/features/consultation-hours.md)
- [Notifications](docs/features/notifications.md)
- [Analytics](docs/features/analytics.md)
- [Tax Records](docs/features/tax-records.md)
- [Task Requests](docs/features/task-requests.md)

## Dev Notes

- Task actions (canEdit, canSubmit, canApprove, etc.) are **server-computed** -- the frontend reads `task.actions.*` directly, never derives permissions locally.
- `FileItem` has `{ id, name }` only -- the `url` field was removed to prevent infrastructure path leaks. `WorkingFileItem` keeps `url` for external links.
- `isOverdue` on invoices and tasks is **server-computed** -- the frontend does not derive it from the due date.
- Analytics formulas differ between system-wide (Manager dashboard) and individual (accountant) views -- see [docs/features/analytics.md](docs/features/analytics.md).
- Email notifications are only sent for invoices and payment receipts -- all other notifications are in-app only.
- Profile updates are atomic (`@Transactional`) -- all 7 JSONB sections overwrite together or not at all.
- One pending profile update per client is enforced at the service layer (not a DB constraint) -- theoretically vulnerable to race conditions on simultaneous requests.
- Consultation duration does not support overnight spans (`endTime` must be after `startTime` within the same day).
- Invoice void is irreversible -- existing payments are preserved but no new payments can be applied.
- Outstanding balance is computed in real-time (not denormalized) via native SQL.
- Tax records protection blocks ALL file downloads for client portal users (not just tax record files). Internal employee users are unaffected.
- Task request approval returns the full `TaxRecordTaskRequestDetailResponse`, which has two ids: `id` (the request) and `resultingTaskId` (the spawned task). Always deep-link to the task via `resultingTaskId` — navigating to `/tax-record-tasks/{request.id}` will 404.
- The `SECTIONS` constant in `src/types/client-info.ts` is the single source of truth for section keys and labels -- never define them inline.
- All context provider values must be wrapped in `useMemo`, callbacks in `useCallback`, and data-fetching `useEffect`s must use a `cancelled` flag with cleanup return.
- No test framework yet -- Vitest recommended. Highest-value targets: contexts (TaxRecordTaskDetails, ClientDetails, UserManagement, ClientOnboarding).

## License

Private. Not open source.

---

Built for **Upturn Business Solutions PH**

Made by Russel & Claude

Copyright 2026 Upturn Business Solutions PH. All rights reserved.
