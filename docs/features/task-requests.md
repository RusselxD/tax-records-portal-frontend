# Tax Record Task Requests

Lets CSD and OOS accountants propose new tax record tasks for a reviewer (QTD or Manager) to approve and create. Keeps task creation load off QTD and lets the people closest to the client initiate work.

## Why a separate entity

Task requests are a distinct entity from `TaxRecordTask` (not a new status on the task) so:

- Rejected requests don't leave orphan task rows
- The existing task state machine (`OPEN → SUBMITTED → … → COMPLETED`) stays clean
- Request list / task list queries stay independent
- Audit of "who requested what" is distinct from task logs

## Lifecycle

```
PENDING --> APPROVED  (reviewer approves → spawns a TaxRecordTask)
PENDING --> REJECTED  (terminal; requester files a new request)
```

- **PENDING** — waiting for review. Server-side uniqueness on `(clientId, taskNameId, year, period)` blocks duplicate pending requests with a 409.
- **APPROVED** — reviewer approved. A `TaxRecordTask` is spawned with the proposed fields + reviewer-set deadline + assignees. `resultingTaskId` is set.
- **REJECTED** — terminal. Requester cannot edit/resubmit; they file a new request. Reviewer cannot edit proposed fields at approval time -- if anything is wrong, reject with a reason and the requester refiles.

## Roles & permissions

| Permission | Roles |
|------------|-------|
| `tax_records.task_request.create` | CSD, OOS |
| `tax_records.task_request.review` | QTD, Manager |

QTD is the primary reviewer; Manager shares the review capability for absence coverage and escalations.

## Entry points

### Creating a request (requester)

Two entry points, same form:

1. **ClientDetails sidebar** — `+ Request` button in the Tasks sidebar card (client pre-filled).
2. **Task Requests page** — `+ New Request` button at the top of the list (client dropdown).

The form takes: client, category → sub-category → task name (cascading from `/tax-record-tasks/lookup-hierarchy`), year, period, and optional notes. New categories/sub-categories/task names cannot be proposed from here -- only existing ones.

### Reviewing (QTD / Manager)

Open `/{rolePrefix}/task-requests` -- list defaults to the Pending tab. The sidebar nav badge shows the pending count and updates live on `TAX_RECORD_TASK_REQUEST_SUBMITTED` WebSocket events.

Click a request to open the detail page. For pending requests, the Review Actions panel exposes:

- **Approve** -- opens a form (not a confirm) with:
  - `deadline` — required
  - `assignedToIds` — multi-select, defaults to `[requester.id]`, can be reassigned to teammates
- **Reject** -- optional reason textarea (max 1000 chars, trimmed). Rejection is terminal.

On approve, the backend creates the task and returns the full `TaxTaskRequestDetailResponse` including `resultingTaskId`. The frontend navigates to `/{rolePrefix}/tax-record-task/{resultingTaskId}`.

## Notification flow

Three notification types, all routed via the standard `referenceType + referenceId` mechanism:

| Type | Sent to | referenceType | referenceId |
|------|---------|---------------|-------------|
| `TAX_RECORD_TASK_REQUEST_SUBMITTED` | QTDs, Manager | `TAX_RECORD_TASK_REQUEST` | request id |
| `TAX_RECORD_TASK_REQUEST_APPROVED` | Requester | `TAX_RECORD_TASK` | **spawned task id** (not request id) |
| `TAX_RECORD_TASK_REQUEST_REJECTED` | Requester | `TAX_RECORD_TASK_REQUEST` | request id |

`APPROVED` deep-links straight to the new task -- the requester usually cares about the task, not the request record, once it's approved. Reuses the existing `TAX_RECORD_TASK` routing handler.

## Pending-count badge

`TaskRequestsContext` (`src/contexts/TaskRequestsContext.tsx`) exposes `pendingCount` + `refreshPending()`:

- Fetches on mount if user has `tax_records.task_request.review`
- Subscribes to `NEW_NOTIFICATION` WebSocket events; refetches when a `TAX_RECORD_TASK_REQUEST_SUBMITTED` arrives
- The sidebar `NavItemLink` checks `item.id === "task-requests"` and renders the badge (same pattern as the notifications badge)
- Approve/reject flows call `refreshPending()` explicitly so the badge decrements immediately

## Key files

- `src/types/tax-record-task-request.ts` -- `TAX_RECORD_TASK_REQUEST_STATUS`, `TaxRecordTaskRequest*` types
- `src/constants/tax-record-task-request.ts` -- status labels + styles + dot colors
- `src/api/tax-record-task-request.ts` -- `list`, `get`, `create`, `approve`, `reject`
- `src/contexts/TaskRequestsContext.tsx` -- pending count state
- `src/features/common/pages/TaxRecordTaskRequests/` -- list page + shared form/modal
  - `TaskRequestForm.tsx` -- shared form; renders a Client picker when `clientId` prop is absent
  - `RequestTaskModal.tsx` -- modal wrapper (accepts optional `clientId` / `clientDisplayName`)
  - `RequestRow.tsx` -- table row
- `src/features/common/pages/TaxRecordTaskRequestDetails/` -- detail page + review modals
  - `components/RequestHeader.tsx`, `ProposedTaskCard.tsx`, `NotesCard.tsx`, `OutcomeCard.tsx`, `AuditCard.tsx`, `ReviewActionsCard.tsx`
  - `components/ApproveRequestModal.tsx` -- approve form (deadline + assignees)
  - `components/RejectRequestModal.tsx` -- reject modal with optional reason

## Routes (per role)

| Role | List | Detail |
|------|------|--------|
| CSD | `/csd/task-requests` | `/csd/task-requests/:id` |
| OOS | `/oos/task-requests` | `/oos/task-requests/:id` |
| QTD | `/qtd/task-requests` | `/qtd/task-requests/:id` |
| Manager | `/manager/task-requests` | `/manager/task-requests/:id` |

## API endpoints

See [api-contracts.md § Tax Record Task Requests](../api-contracts.md#tax-record-task-requests).
