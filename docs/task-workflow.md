# Tax Record Task Workflow

## Task Statuses

Six statuses govern the lifecycle of a tax record task:

`OPEN`, `SUBMITTED`, `REJECTED`, `APPROVED_FOR_FILING`, `FILED`, `COMPLETED`

```
OPEN --> SUBMITTED --> APPROVED_FOR_FILING --> FILED --> COMPLETED
              |  ^
              v  |
           REJECTED (resubmit moves back to OPEN)

SUBMITTED --> OPEN (via RECALL)
```

- **OPEN**: Task is editable. Accountant can attach files and submit.
- **SUBMITTED**: Awaiting reviewer action. Can be approved, rejected, or recalled.
- **REJECTED**: Returned to accountant with feedback. Resubmitting moves it back to OPEN.
- **APPROVED_FOR_FILING**: Approved by reviewer. Proof of filing becomes visible from this point onward.
- **FILED**: Marked as filed with the BIR.
- **COMPLETED**: Terminal status. Files merge into `tax_record_entries`.

## Server-Provided Action Flags

`TaxRecordTaskDetailResponse.actions: TaskActions` contains 11 booleans computed by the backend based on task status, user role, and assignment:

| Flag                 | Description                              |
|----------------------|------------------------------------------|
| `canEdit`            | Edit task metadata                       |
| `canSubmit`          | Submit task for review                   |
| `canRecall`          | Recall a submitted task                  |
| `canApprove`         | Approve the task                         |
| `canReject`          | Reject the task                          |
| `canMarkFiled`       | Mark as filed                            |
| `canMarkCompleted`   | Mark as completed                        |
| `canUploadWorkingFiles` | Upload working files                  |
| `canUploadOutput`    | Upload/replace the output file           |
| `canUploadProof`     | Upload/replace proof of filing           |
| `canDelete`          | Delete the task                          |

Frontend-derived flags:

- `canReview = actions.canApprove || actions.canReject`
- `canEditProof = actions.canUploadProof`

The frontend reads `task.actions.*` directly and does not derive permissions locally.

## File Types

Three file categories are attached to a task:

### 1. Working Files

Supporting documents (spreadsheets, source data, etc.). Multiple files and links allowed. On task completion, these are appended to the tax record entry (deduped by `fileId`).

### 2. Output File

Single main deliverable (the tax return). Overwrites on upload. On task completion, overwrites the existing entry output file.

### 3. Proof of Filing

Single BIR confirmation document. Visible from `APPROVED_FOR_FILING` onwards. Overwrites on upload. On task completion, overwrites the existing entry proof file.

`FileItem` shape: `{ id, name }` -- no `url` field (removed as infrastructure path leak). `WorkingFileItem` retains `url` for external links.

## File Merge on Completion

When a task reaches `COMPLETED`, three things merge into `tax_record_entries`:

1. Working files are appended (deduped by `fileId`)
2. Output file overwrites existing
3. Proof of filing overwrites existing

If a matching entry exists (same client / category / subcategory / taskName / year / period), it updates the existing record. Otherwise a new entry is created.

## Task Creation

### Single Task

Cascading dropdowns: category --> subcategory --> taskName. New entries can be created inline via "+ Add New". Unused entries can be deleted from the dropdown (items referenced by existing tasks cannot be deleted).

### Bulk Import

Excel template upload --> preview table --> submit.

- **Category / SubCategory / TaskName**: case-insensitive matching; auto-creates if not found.
- **Client / Accountant**: matched by UUID, not name. Client must have status `ACTIVE_CLIENT`. Accountant must be CSD/OOS and assigned to the client.
- **Period**: case-insensitive (uppercased on import).
- **Deadline**: must be a valid `YYYY-MM-DD` date.
- **Duplicate check**: same client / category / subcategory / taskName / year / period / deadline.

## Task Deletion

Deletion is only allowed when ALL conditions are met:

- Status is `OPEN`
- No activity logs
- No working files
- No output file
- No proof of filing

Files are NOT deleted from R2 storage -- only the database record is removed.

## Task Recall

- Available while status is `SUBMITTED`
- No time limit and no locking mechanism
- Moves the task back to `OPEN`
- The `@Version` annotation on the entity is for optimistic locking on concurrent saves, not a review lock

## Overdue Logic

A task is overdue when:

1. The deadline has passed, AND
2. Status is `OPEN` or `REJECTED`

Submitted tasks are excluded because the ball is with the reviewer.

- Visual indicator: red left border (`border-l-4 border-l-red-400`) on task rows
- `isOverdue` is computed by the server

## Workflow Actions -- Frontend Pattern

All workflow actions (`submit`, `approve`, `reject`, `markFiled`, `markCompleted`, `recall`) trigger a full `refetch()` so that server-recomputed action flags update the UI.

File operations (`upload`, `delete`) only trigger `refetchFiles()` -- no full page reload.
