# Tax Records (Drill-Down + Versioning)

The tax records feature lets users browse completed `TaxRecordEntry` rows via a hierarchical drill-down and download files in bulk. Entries are created automatically when a tax record task is marked `COMPLETED`.

## Drill-down hierarchy

```
category → subCategory → taskName → year → period → [version?] → record
```

The `version` level is **conditional** -- it only appears when a given drill-down key (category+subCategory+taskName+year+period, or "DD") has 2+ entries. A DD with a single entry skips version and returns the record directly.

## Versioning

Previously, completing a task whose DD already existed would merge files and silently overwrite the prior output/proof of filing. This destroyed history. Now each completed task creates a new `TaxRecordEntry`, and duplicate DDs coexist as separate versions.

Versioning rules:

- Every entry carries an integer `version` internally (starts at 1, increments per DD key per client).
- Display rule: the backend returns `version: null` on the response when that DD has only one entry. The frontend only renders a `v{n}` badge when `version != null`.
- A DD with 3 completions shows entries as `v1`, `v2`, `v3`. A DD with 1 completion shows no badge.

## Drill-down response shapes

```ts
// Items level (category, subCategory, taskName, year, period, version)
{ level: "category" | "subCategory" | "taskName" | "year" | "period" | "version",
  items: DrillDownItem[],
  taxRecordsProtected?: boolean }

// Record level (leaf)
{ level: "record", record: TaxRecordEntryResponse, taxRecordsProtected?: boolean }
```

`TaxRecordEntryResponse` includes:

```ts
{
  id, categoryName, subCategoryName, taskName, year, period,
  version: number | null,         // NEW -- null when DD has 1 entry
  workingFiles, outputFile, proofOfFilingFile
}
```

## Frontend state model

`DrillSelection` carries an explicit `kind: DrillDownLevel` on each step so the breadcrumb stack can survive the conditional version level without positional inference:

```ts
interface DrillSelection { id: string; label: string; kind: DrillDownLevel }
```

`buildFilters(selections)` iterates by `sel.kind` (not array index) to produce the `DrillDownFilters` query params:

```ts
{ categoryId?, subCategoryId?, taskNameId?, year?, period?, version? }
```

`currentLevel` is driven from the **response's** `level` field, not from `selections.length`. Initial state is `"category"`; after every fetch, `setCurrentLevel(res.level)` updates it. This is what makes the conditional version step work correctly.

## Bulk download

`BulkDownloadRequest.level` is typed as `Exclude<DrillDownLevel, "record" | "version">` -- bulk download is not valid at the version level (you're already inside a single period/version scope). `handleBulkDownload` early-returns at those levels. The existing `DrillDownList` still renders its Select button at version level, but clicking it no-ops.

ZIP structure: DDs with 1 entry keep the old layout. DDs with 2+ entries nest under `v1/`, `v2/`, etc. -- e.g. `Category/SubCategory/TaskName/2025/Q1/v2/Output Files/return.pdf`.

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/tax-records/me/drill-down` | Drill-down for current user. Query: `DrillDownFilters` |
| GET | `/tax-records/client/{clientId}/drill-down` | Drill-down for a specific client (Manager/CSD/QTD/OOS/VIEWER). Query: `DrillDownFilters` |
| POST | `/tax-records/me/bulk-download` | Bulk download (self). Body: `BulkDownloadRequest`, returns blob |
| POST | `/tax-records/{clientId}/bulk-download` | Bulk download (specific client). Body: `BulkDownloadRequest`, returns blob |

Both drill-down endpoints accept an optional `version` query param when fetching a specific version's record.

## Tax records protection

`ClientInfoHeaderResponse.offboarding.taxRecordsProtected` (toggled via `PATCH /clients/{clientId}/tax-records-protection`, Manager only) blocks **all** file downloads for client portal users. Internal employee users (including VIEWER) are unaffected. The drill-down response includes `taxRecordsProtected: true` as a flag so the UI can show the banner.

## Key files

- `src/types/tax-record.ts` -- `DRILL_DOWN_LEVEL`, `DrillDownLevel`, `DrillDownFilters`, `DrillDownResponse`, `TaxRecordEntryResponse`, `DrillSelection`, `BulkDownloadRequest`
- `src/api/tax-record.ts` -- `taxRecordAPI.drillDown`, `clientDrillDown`, `bulkDownload`, `clientBulkDownload`
- `src/features/client/pages/TaxRecords/TaxRecords.tsx` -- client self-service drill-down
- `src/features/common/pages/ClientDetails/components/ClientTaxRecords.tsx` -- manager/CSD/OOS/QTD/VIEWER viewing a client
- `src/features/client/pages/TaxRecords/components/DrillDownList.tsx` -- generic list renderer (used at every non-record level)
- `src/features/client/pages/TaxRecords/components/TaxRecordDetail/components/RecordDetails.tsx` -- renders the `v{n}` badge next to "Record Details" when `record.version != null`
- `src/features/client/pages/TaxRecords/components/Breadcrumbs.tsx` -- breadcrumb stack (unchanged -- it reads `sel.label` so version steps render automatically as "v2", etc.)
