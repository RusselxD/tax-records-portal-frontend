# Notifications

In-app notification system for internal users. Client portal users do not receive notifications.

## Email vs In-App

**Only these are sent as email:**

- Invoice emails (Send Email action on an invoice)
- Payment receipt emails (Send Receipt action on a payment)

**Everything else is in-app only** — task assignments, submissions, approvals, rejections, handoffs, offboarding assignments, and profile submissions are never emailed. There is no batching, no delay, and no user opt-out mechanism.

## Notification Types by Role

### Manager

| Type | Trigger |
|------|---------|
| Task Submitted | Accountant submitted a task for review |
| Task Approved | Task approved (by Manager or QTD) |
| Task Rejected | Task rejected |
| Task Filed | Accountant marked a task as filed |
| Task Completed | Task completed |
| Client Handoff | Client handed off by OOS |
| Profile Submitted | Client profile submitted for review |
| Offboarding Assigned | OOS accountant assigned to offboard a client |

### OOS

| Type | Trigger |
|------|---------|
| Task Assigned | New task assigned |
| Task Approved | Submission approved by reviewer |
| Task Rejected | Submission rejected |
| Task Completed | Task completed |
| Client Handoff | Client handed off and assigned to you |
| Offboarding Assigned | Assigned as offboarding accountant |
| Profile Approved | Submitted profile was approved |
| Profile Rejected | Submitted profile was rejected |

### CSD

| Type | Trigger |
|------|---------|
| Task Assigned | New task assigned |
| Task Approved | Submission approved by reviewer |
| Task Rejected | Submission rejected |
| Task Completed | Task completed |
| Client Handoff | Client handed off and assigned to you |

### QTD

| Type | Trigger |
|------|---------|
| Task Submitted | Accountant submitted a task for review |
| Task Filed | Accountant marked a task as filed |
| Task Completed | Task reviewed has been completed |
| Profile Submitted | Client profile submitted for review |

## Frontend Architecture

### NotificationsContext

Global context (`src/contexts/NotificationsContext.tsx`):

- Exposes `unreadCount`, `decrementUnread()`, `refetchUnreadCount()`
- Fetches count on mount (only for non-CLIENT users)
- Uses cancelled flag + cleanup for proper async handling

### UI Elements

| Element | Behavior |
|---------|----------|
| TopNav bell icon | Dot indicator when unread > 0. Clicks navigate to `{rolePrefix}/notifications`. |
| Sidebar badge | Numeric count of unread notifications |

### Notifications Page

- Infinite scroll with page size 15
- Pagination: `ScrollResponse { content, hasMore }`
- Click a notification to navigate to the relevant page

### Navigation Routing

| Notification Type | Routes To |
|-------------------|-----------|
| CLIENT_HANDOFF | Client details page |
| All other client notifications | Client preview page |
| Task notifications | Task details page |
