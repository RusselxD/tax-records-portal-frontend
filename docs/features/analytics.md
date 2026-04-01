# Analytics

Analytics are available for OOS and CSD (personal "My Analytics" page) and Manager (system-wide dashboard cards + per-accountant "Accountant Analytics" page). QTD has no dedicated analytics.

## Stat Cards

All metrics below are scoped to the individual accountant (whether viewing your own "My Analytics" or a Manager drilling into an accountant's profile).

### Task Pipeline

All tasks assigned to the accountant by status: Open, Submitted, Rejected, Approved for Filing, Filed, Completed.

### Deadlines

Only counts tasks in **Open or Rejected** status — Submitted tasks are excluded (reviewer's responsibility).

| Metric | Definition |
|--------|-----------|
| Overdue | deadline < today |
| Due Today | deadline = today |
| Due This Week | today <= deadline < today + 7 calendar days |

- Timezone: Asia/Manila
- Literal 7-day window, not calendar week
- Due Today is a subset of Due This Week — they overlap, no deduplication

### Productivity (current month)

| Metric | Definition |
|--------|-----------|
| Completed This Month | Distinct tasks completed since the 1st |
| Submitted This Month | Distinct tasks submitted for review. Resubmissions of the same task don't inflate this. |
| New Tasks This Month | Tasks assigned to them that were created since the 1st |

### Efficiency (all-time)

| Metric | Definition |
|--------|-----------|
| On-Time Rate | % of completed tasks where completion <= deadline. All tasks have deadlines. |
| Avg Completion Days | Calendar days (weekends/holidays included). Formula: `(completed_at - created_at) / 86400`. Same-day completions show as fractional values. |

### Quality (all-time)

| Metric | Definition |
|--------|-----------|
| First-Attempt Approval Rate | Denominator: all tasks submitted at least once. Numerator: those with zero REJECTED log entries. |
| Avg Rejection Cycles | See important note below. |

**Avg Rejection Cycles — System vs Individual:**

This metric uses **two intentionally different formulas**:

| Context | Formula | Rationale |
|---------|---------|-----------|
| Manager system dashboard | `AVG(rejection_count)` across ALL submitted tasks, **including zero-rejection tasks** | Overall quality signal — diluted average shows system health |
| Individual accountant analytics | `AVG(rejection_count)` WHERE `rejection_count > 0` — **excludes zero-rejection tasks** | "When rejections happen, how many cycles?" |

For the individual formula: 1.0 means rejections are resolved in one revision. 3.0+ suggests repeated back-and-forth.

### Responsiveness (all-time)

| Metric | Definition |
|--------|-----------|
| Avg Days to First Submit | Average days from task creation to first submission. **Excludes never-submitted tasks** — CTE filters on `HAVING MIN(created_at) FILTER (WHERE action = 'SUBMITTED') IS NOT NULL`. |
| Avg Rejection Turnaround | Average days between a REJECTED action and the next SUBMITTED action. Uses `LEAD()` window function. Only counts REJECTED→SUBMITTED gaps. RECALLED→RESUBMITTED gaps are excluded because RECALLED is not in the filtered action set. |

### Workload (current)

| Metric | Definition |
|--------|-----------|
| Active Task Count | All non-completed tasks (open + submitted + rejected + approved for filing + filed) |
| Assigned Client Count | Distinct clients with at least one active task assigned to this accountant |

### Monthly Trend

- Formula: `(thisMonth - lastMonth) * 100.0 / lastMonth`
- If lastMonth = 0: returns null (frontend shows "N/A")
- If both months = 0: also null
- Positive = improving, negative = slipping

## Charts

| Chart | Type | Details |
|-------|------|---------|
| Tasks by Category | Bar | Distribution across tax categories, split by active vs completed |
| Monthly Throughput | Line | Completed tasks over time, adjustable range: 3, 6, or 12 months |
| On-Time Rate | Donut | On-time vs late completions |
| Quality Metrics | Summary | Total submissions, first-attempt approvals, approval rate, avg rejection cycles |

## Client Portfolio Table

Shows all clients assigned to the accountant:

| Column | Description |
|--------|------------|
| Client Name | Clickable — navigates to client details |
| Status | Current client status |
| Total Tasks | All tasks for this client assigned to the accountant |
| Pending | Non-completed tasks |
| Overdue | Tasks past deadline in Open/Rejected status |
| Nearest Deadline | Closest upcoming deadline |

## Client Status Distribution (OOS only)

Donut chart showing the OOS accountant's clients by status: Onboarding, Active, Offboarding, Inactive. Center displays total client count.

## Accountant Analytics Page (Manager)

Shows all CSD and OOS accountants as cards:

| Card Field | Description |
|------------|------------|
| Name | Accountant's full name |
| Position | Job position |
| Role | CSD or OOS |
| Active Tasks | Non-completed task count (red highlight when overdue > 0) |
| Assigned Clients | Distinct client count |
| Overdue Tasks | Tasks past deadline in Open/Rejected status |

Search by name or position. Click a card to drill into that accountant's full analytics (same stat cards + charts as the individual "My Analytics" page).

Accessible from the Dashboard via "View all" on the Accountant Workload chart.
