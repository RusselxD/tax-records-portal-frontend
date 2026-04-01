# Client Info System

The client info system manages the 7-section profile data for each client. It uses a split API architecture with lazy-loaded sections and is consumed by three different contexts.

## Split API Architecture

Client info is divided into a lightweight header (always loaded) and heavy sections (loaded on demand).

### Header

`GET /clients/{id}/info/header` returns `ClientInfoHeaderResponse`:

```
{
  displayName, taxpayerClassification, status, pocEmail,
  isProfileApproved, handedOff,
  accountants: {
    csdOos: string[],
    qtd: string[]
  },
  taskReview: {
    hasActiveTask, activeTaskId, activeTaskType, lastReviewStatus
  },
  offboarding: {
    accountantName, endOfEngagementDate, deactivationDate,
    taxRecordsProtected, endOfEngagementLetterSent
  }
}
```

### Sections

`GET /clients/{id}/info/sections/{sectionKey}` returns individual section data.

Seven section keys, defined in the `SECTIONS` constant (`src/types/client-info.ts`):

| Key | Label |
|-----|-------|
| mainDetails | Main Details |
| clientInformation | Client Information |
| officerInformation | Owner's or Corporate Officer's Information |
| accessCredentials | Access and Credentials |
| scopeOfEngagement | Scope of Engagement |
| professionalFees | Professional Fees |
| onboardingInfo | Onboarding Info, Documents and Notes |

The `SECTIONS` constant is the single source of truth. It is re-exported from context files. Never define section labels or keys inline.

## Lazy Loading

The `useLazySections` hook manages the section cache:

- **States per section**: idle, loading, loaded, error
- **Deduplication**: In-flight requests tracked via `inFlight` ref — opening the same section twice doesn't fire two API calls
- **Trigger**: Sections load when their accordion is opened (or on mount if `defaultOpen` is true)
- **SectionCard component**: Calls `onOpen` when expanded, passes `status` for loading/error states

## Consumer Contexts

The same data model is consumed by three different page-level contexts:

### 1. ClientDetailsContext

**Path**: `src/features/common/pages/ClientDetails/context/`

Used for the live client details page and the frozen snapshot view.

- **Live mode**: Fetches header, lazy-loads sections via `useLazySections`
- **Snapshot mode**: Pre-populates all sections from the archive snapshot (no lazy loading needed)
- Mode determined by route (`client-details` vs `client-snapshot`)
- Exposes `refetchData`, `setStatus`, `getSection`, `fetchSection`

### 2. ClientOnboardingPreviewContext

**Path**: `src/features/common/pages/ClientOnboardingPreview/context/`

Used for the onboarding review page where QTD/Manager reviews a new client's profile.

- Fetches the client info task + header
- Optionally fetches client accounts if user has `CLIENT_INFO_CREATE` permission
- Lazy-loads sections via `useLazySections`
- Shows review actions (approve/reject) based on `taskReview` state
- Exposes `refetchData`, signals for logs refresh

### 3. NewClientContext

**Path**: `src/features/oos/pages/NewClient/context/`

Used for creating and editing client profiles.

- **Create mode**: Fetches full template with all sections pre-populated
- **Edit mode**: Fetches header only, lazy-loads sections on demand
- Tracks dirty state with `useRef` for `beforeunload` warning
- Complex `submitUpdate` that fetches any unloaded sections before saving
- `NewClientShimProvider` available for reuse outside the main context

## Data Model

```typescript
{
  header: ClientInfoHeaderResponse;
  sections: Partial<ClientInfoSections>;  // lazy — may not all be loaded
}
```

- Sections are partial in edit mode (loaded on demand)
- Sections are complete in template/create mode (all loaded at once)
- Accountant IDs are populated reactively via `useEffect` when header + mainDetails are both loaded

## Profile Update Flow

1. Accountant clicks "Edit Profile" on client details page
2. Opens the edit form — makes changes across any sections
3. Submits update with optional comment → creates a `PROFILE_UPDATE` task
4. QTD/Manager sees diff view (current vs proposed, section by section)
5. **Approve** → all 7 JSONB sections overwrite atomically (`@Transactional`)
6. **Reject** → accountant gets notification with reviewer's feedback
7. Only one pending update per client at a time (409 Conflict if duplicate)

Profile updates do NOT change the client's status.

### File Previews in Diff

For file fields (scanned IDs, engagement letters, etc.), the diff includes `oldFileId` and `newFileId` alongside the filename strings. The reviewer can preview both the current and proposed files directly from the diff view using `FilePreviewButton`, which opens a `FilePreviewOverlay` modal. Non-file fields show plain text as before.

## ClientInfoPageShell

Shared layout component used by client info pages. Accepts `headerActions?: ReactNode` for role-specific actions in the header area (e.g., Manager's "Change Status" button).

## Key Files

| File | Purpose |
|------|---------|
| `src/types/client-info.ts` | `SECTIONS` constant, `SECTION_KEYS`, section types |
| `src/types/client-profile.ts` | `ClientInfoHeaderResponse`, `ClientInfoSections` |
| `src/hooks/useLazySections.ts` | Lazy section loading hook |
| `src/features/common/components/client-info/` | Shared section rendering components |
