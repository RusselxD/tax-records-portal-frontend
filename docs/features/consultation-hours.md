# Consultation Hours

Accountants (OOS, CSD) log consultations rendered to clients. Logs go through a review process before being counted toward billing.

## Consultation Log Lifecycle

```
DRAFT → SUBMITTED → APPROVED (billable type computed)
                  → REJECTED → (edit & resubmit) → SUBMITTED
```

| Status | Description |
|--------|------------|
| Draft | Saved but not yet submitted |
| Submitted | Awaiting QTD/Manager review |
| Approved | Reviewed and accepted — billable type assigned |
| Rejected | Sent back with feedback for correction |

Status transitions use POST endpoints (`/consultation-logs/{id}/submit`, `/approve`, `/reject`).

## Log Fields

| Field | Required | Details |
|-------|----------|---------|
| Client | Yes | Select from assigned clients |
| Date | Yes | Consultation date |
| Platform | Yes | Communication platform used |
| Start Time | Yes | Session start |
| End Time | Yes | Session end |
| Subject | Yes | Brief topic description |
| Notes | No | Rich text (TipTap) with optional image embeds |
| Attachments | No | Supporting files |
| Courtesy | No | Toggle — excludes from billing |

## Duration Calculation

- Formula: `(endTime - startTime)` in minutes, divided by 60
- Rounded to 2 decimal places (HALF_UP)
- No overnight support — if endTime < startTime, backend returns 400 error
- No maximum duration cap

## Billable Type Computation

Three types: **Included**, **Excess**, **Courtesy**

### How it works

On each approval, the system:

1. Loads ALL approved logs for that client + month
2. Sorts chronologically by date, then start time
3. Walks through logs, accumulating hours against the client's `includedHours` cap
4. Logs within the cap are **Included**
5. Once cumulative hours exceed the cap, remaining logs become **Excess**
6. **Courtesy** logs (manually flagged) are excluded from accumulation entirely

Each approval recomputes the entire month. Approving log #3 may change the billable type of a previously-approved log #4 if cumulative hours now exceed the cap.

### Edge cases

| Scenario | Behavior |
|----------|----------|
| Client has no consultation config | Monthly summary endpoint returns 404. On approval, cap defaults to 0 — all non-courtesy logs become Excess. |
| Multiple logs approved in sequence | Each approval triggers full month recomputation |
| Hours precision | Rounded to 2 decimal places (HALF_UP) |

## Monthly Summary

Displayed on the Client Details page under the Consultations tab:

- **Progress bar**: included hours used vs cap
- **Hours breakdown**: included, excess, courtesy totals
- **Estimated excess fees**: `excessHours x excessRate`
- **Approved logs table**: all approved logs for the selected month

## Consultation Config

Per-client configuration, set during onboarding in the Scope of Engagement section:

| Field | Purpose |
|-------|---------|
| `includedHours` | Monthly cap of included consultation hours |
| `excessRate` | Per-hour rate charged for excess consultations |

## Review Process

- QTD and Manager can approve or reject
- Comment can be added with the decision
- Rejected logs show a red banner with "Edit and Resubmit" button
- Accountant corrects the log and resubmits (returns to Submitted status)
