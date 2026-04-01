# Dashboard

Each internal role has a tailored dashboard. Billing and Client roles have no dashboard.

## Manager Dashboard

Eight stat cards and four charts providing a system-wide overview.

### Stat Cards

#### Card 1: Client Portfolio

All-time client count broken down by status: Onboarding, Active, Offboarding, Inactive. No date filter — every client ever created is included.

#### Card 2: Task Pipeline

All-time tasks grouped by status: Open, Submitted, Rejected, Approved for Filing, Filed, Completed.

#### Card 3: Overdue and Upcoming

Tasks needing attention based on urgency. Only counts tasks in **Open or Rejected** status — Submitted tasks are excluded because the ball is with the reviewer.

| Metric | Definition |
|--------|-----------|
| Overdue | deadline < today |
| Due Today | deadline = today (subset of Due This Week) |
| Due This Week | today <= deadline < today + 7 calendar days |

- Timezone: Asia/Manila
- "Due This Week" is a literal 7-day window, not a calendar week (Mon-Sun)
- Due Today and Due This Week **overlap** — reported as separate counts without deduplication

#### Card 4: Review Queue

Pending profile reviews:

- Onboarding Profiles Pending — new client profiles submitted by OOS
- Profile Updates Pending — changes to active client profiles submitted by accountants

#### Card 5: Monthly Activity

Counts since the 1st of the current month:

| Metric | Definition |
|--------|-----------|
| Tasks Completed This Month | Tasks that reached Completed status |
| Tasks Created This Month | New tasks created |
| Tasks Rejected This Month | Rejection **events**, not distinct tasks. A task rejected twice in the same month counts as 2 |

#### Card 6: Efficiency

| Metric | Definition |
|--------|-----------|
| Avg Completion Time | Calendar days from task creation to completion (includes weekends/holidays). Formula: `(completed_at - created_at) / 86400`. Same-day completions show as fractional values (e.g. 0.21). All-time across all completed tasks. |
| On-Time Rate | Percentage of completed tasks where completion happened on or before the deadline. All tasks have deadlines (NOT NULL column). All-time. |

#### Card 7: Quality

| Metric | Definition |
|--------|-----------|
| First-Attempt Approval Rate | Denominator: all tasks submitted at least once. Numerator: those with zero REJECTED log entries. |
| Avg Rejection Cycles | `AVG(rejection_count)` across ALL submitted tasks, **including zero-rejection tasks**. This dilutes the average intentionally — it gives an overall quality signal for the system. See [analytics.md](analytics.md) for how the individual accountant formula differs. |

#### Card 8: Onboarding Funnel

Current month metrics:

| Metric | Definition |
|--------|-----------|
| Onboarding Clients | Same as Card 1 onboarding count |
| Profiles Pending Review | Same as Card 4 onboarding count |
| Clients Activated This Month | Client portal User records (role = CLIENT) created since the 1st. Counted once per account — resending activation email does NOT create a new count. |

### Charts

| Chart | Type | Details |
|-------|------|---------|
| Task Completion Trend | Line | 7d = 7 daily points, 30d = 30 daily points, 3m = 13 weekly points (Monday-start weeks) |
| Task Approval Rate | Donut | Counts individual **decisions**, not tasks. A task rejected 3x then approved = 4 decisions (3 rejected + 1 approved). Has range filter. |
| Accountant Workload | Bar | Top 5 CSD/OOS accountants by active task count (all statuses except Completed). Sorted descending. "View all" links to Accountant Analytics page. |
| Tasks by Category | Stacked bar | Task distribution across categories, broken down by status |

---

## OOS / CSD Dashboard

Four stat cards, two attention tables, and a personal to-do list.

### Stat Cards

| Metric | Description |
|--------|------------|
| Open Tasks | Tasks in Open status assigned to you |
| Newly Assigned Today | Tasks created and assigned today |
| Submitted for Review | Your tasks currently in Submitted status |
| Approved for Filing | Your tasks in Approved for Filing status |

### Attention Tables

Both tables are collapsible and paginated (10 per page), matching the style of the other task lists on the dashboard.

**Overdue Tasks** — Tasks past their deadline that haven't been submitted yet. Only Open and Rejected status tasks qualify.

**Rejected Tasks** — Tasks sent back for revision. Open to see reviewer comments and make corrections.

### To-Do List

Personal checklist for notes and reminders. Only visible to the user who created them.

---

## QTD Dashboard

Three stat cards and two tables focused on the review workflow.

### Stat Cards

| Metric | Definition |
|--------|-----------|
| Awaiting Review | Submitted tasks from **clients assigned to you** only — not all submitted tasks in the system. Shows a "new today" pill if new tasks arrived. |
| Approved Today | Tasks you approved today |
| Approval Rate | Current month. Counts individual **decisions** — reject + approve same task in one month = 1 approval + 1 rejection = 50%. Shows "—" if no reviews this month. |

### Tables

**Review Queue** — Submitted tasks from assigned clients waiting for review. Click to open task details and take action.

**Recently Decided** — Tasks you recently approved or rejected for review history tracking.
