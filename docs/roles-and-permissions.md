# Roles and Permissions

## The 7 Roles

| Role Key   | Display Name                        | Description                                                                 |
|------------|-------------------------------------|-----------------------------------------------------------------------------|
| `MANAGER`  | Manager                             | System admin, oversees everything, only role that can change client status   |
| `OOS`      | Onboarding, Offboarding & Support   | Creates/onboards clients, handles offboarding, works on tasks               |
| `QTD`      | Quality, Training & Development     | Reviews profiles and tasks, manages task creation                           |
| `CSD`      | Client Service Delivery             | Works on assigned tasks, manages client profiles                            |
| `BILLING`  | Internal Accounting / Billing       | Manages invoices and payments                                               |
| `VIEWER`   | Viewer                              | Shared read-only stakeholder account -- browses clients, tax records, consultations |
| `CLIENT`   | Client                              | Client portal access, views their records and invoices                      |

Defined in `src/constants/roles.ts` as the `UserRole` constant object.

## Role Key vs Display Name

The JWT token contains two role-related fields:

- **`role`** -- the human-readable display name (e.g., `"Onboarding, Offboarding & Support"`)
- **`roleKey`** -- the logic key used in code (e.g., `"OOS"`)

Always use `user.roleKey` for routing, guards, and conditional logic. Never use `user.role` (the display name) for logic.

### getRolePrefix(roleKey)

Maps each role key to its URL route prefix:

| Role Key   | Route Prefix         |
|------------|----------------------|
| `MANAGER`  | `/manager`           |
| `OOS`      | `/oos`               |
| `QTD`      | `/qtd`               |
| `CSD`      | `/csd`               |
| `BILLING`  | `/internal-billing`  |
| `VIEWER`   | `/viewer`            |
| `CLIENT`   | `/client`            |

### getDashboardUrl(roleKey)

Returns the default landing page for each role:

| Role Key   | Dashboard URL                |
|------------|------------------------------|
| `MANAGER`  | `/manager/dashboard`         |
| `OOS`      | `/oos/dashboard`             |
| `QTD`      | `/qtd/dashboard`             |
| `CSD`      | `/csd/dashboard`             |
| `BILLING`  | `/internal-billing/clients`  |
| `VIEWER`   | `/viewer/clients`            |
| `CLIENT`   | `/client/dashboard`          |

Note: VIEWER has no dashboard -- it lands directly on the client list.

## Permissions

There are 35 active permissions defined in `src/constants/permissions.ts`. Use the `hasPermission()` utility to check permissions:

```ts
import { hasPermission, Permission } from "../constants";

if (hasPermission(user.permissions, Permission.CLIENT_MANAGE)) {
  // show Manager-only UI
}
```

### User Management

| Permission Key   | Constant             | Description                       |
|------------------|----------------------|-----------------------------------|
| `user.create`    | `Permission.USER_CREATE`   | Create new user accounts    |
| `user.view.all`  | `Permission.USER_VIEW_ALL` | View all users in the system |

### Client

| Permission Key      | Constant                   | Description                                          |
|----------------------|----------------------------|------------------------------------------------------|
| `client.create`     | `Permission.CLIENT_CREATE`   | Create new client records                          |
| `client.view.own`   | `Permission.CLIENT_VIEW_OWN` | View clients assigned to the user                 |
| `client.view.all`   | `Permission.CLIENT_VIEW_ALL` | View all clients in the system                    |
| `client.assign`     | `Permission.CLIENT_ASSIGN`   | Assign accountants to clients during onboarding   |
| `client.reassign`   | `Permission.CLIENT_REASSIGN` | Reassign accountants on active clients            |
| `client.manage`     | `Permission.CLIENT_MANAGE`   | Manager-only -- gates client status changes       |

### Client Info

| Permission Key          | Constant                        | Description                                |
|-------------------------|---------------------------------|--------------------------------------------|
| `client_info.create`    | `Permission.CLIENT_INFO_CREATE`   | Create client info profiles              |
| `client_info.edit`      | `Permission.CLIENT_INFO_EDIT`     | Edit existing client info sections       |
| `client_info.review`    | `Permission.CLIENT_INFO_REVIEW`   | Review and approve/reject client profiles |
| `client_info.view.own`  | `Permission.CLIENT_INFO_VIEW_OWN` | View own client's info                   |
| `client_info.view.all`  | `Permission.CLIENT_INFO_VIEW_ALL` | View all client info profiles            |

### Tax Records

| Permission Key          | Constant                        | Description                          |
|-------------------------|---------------------------------|--------------------------------------|
| `tax_records.view.own`  | `Permission.TAX_RECORDS_VIEW_OWN` | View own assigned tax records      |
| `tax_records.view.all`  | `Permission.TAX_RECORDS_VIEW_ALL` | View all tax records in the system |

### Tasks

| Permission Key    | Constant                 | Description                              |
|-------------------|--------------------------|------------------------------------------|
| `task.create`     | `Permission.TASK_CREATE`   | Create new tax record tasks            |
| `task.view.own`   | `Permission.TASK_VIEW_OWN` | View tasks assigned to the user        |
| `task.view.all`   | `Permission.TASK_VIEW_ALL` | View all tasks in the system           |
| `task.execute`    | `Permission.TASK_EXECUTE`  | Execute/work on tasks (upload files, submit) |
| `task.review`     | `Permission.TASK_REVIEW`   | Review tasks (approve/reject)          |

### Tax Record Task Requests

| Permission Key                      | Constant                                    | Description                                                 |
|-------------------------------------|---------------------------------------------|-------------------------------------------------------------|
| `tax_records.task_request.create`   | `Permission.TAX_RECORD_TASK_REQUEST_CREATE` | Submit task requests (CSD/OOS) for a reviewer to approve    |
| `tax_records.task_request.review`   | `Permission.TAX_RECORD_TASK_REQUEST_REVIEW` | Approve/reject task requests (QTD/Manager); spawns the task |

### Billing

| Permission Key      | Constant                    | Description                            |
|---------------------|-----------------------------|----------------------------------------|
| `billing.manage`    | `Permission.BILLING_MANAGE`   | Full billing management (create/edit invoices) |
| `billing.view.own`  | `Permission.BILLING_VIEW_OWN` | View own invoices (Client role)       |

### Documents and Reminders

| Permission Key       | Constant                     | Description                  |
|----------------------|------------------------------|------------------------------|
| `document.upload`    | `Permission.DOCUMENT_UPLOAD`   | Upload documents           |
| `reminder.create`    | `Permission.REMINDER_CREATE`   | Create reminders           |

### Consultation

| Permission Key                 | Constant                               | Description                                  |
|--------------------------------|----------------------------------------|----------------------------------------------|
| `consultation.create`          | `Permission.CONSULTATION_CREATE`         | Create consultation log entries            |
| `consultation.view.own`        | `Permission.CONSULTATION_VIEW_OWN`       | View own consultation logs                 |
| `consultation.view.all`        | `Permission.CONSULTATION_VIEW_ALL`       | View all consultation logs                 |
| `consultation.review`          | `Permission.CONSULTATION_REVIEW`         | Approve/reject consultation logs           |
| `consultation.config.manage`   | `Permission.CONSULTATION_CONFIG_MANAGE`  | Manage consultation configuration          |
| `consultation.view.own.client` | `Permission.CONSULTATION_VIEW_OWN_CLIENT`| Client viewing their own consultation logs |

### Notifications and Analytics

| Permission Key           | Constant                         | Description                          |
|--------------------------|----------------------------------|--------------------------------------|
| `notification.receive`   | `Permission.NOTIFICATION_RECEIVE`  | Receive system notifications       |
| `analytics.system.view`  | `Permission.ANALYTICS_SYSTEM_VIEW` | View system-wide analytics         |

## Route Access per Role

### Manager (`/manager`)

| Page                    | Shared | Description                              |
|-------------------------|--------|------------------------------------------|
| Admin Dashboard         | No     | System-wide overview and statistics      |
| User Management         | No     | Create and manage user accounts          |
| Accountant Analytics    | No     | System-wide accountant performance       |
| Accountant Detail       | No     | Individual accountant analytics          |
| Client List             | Yes    | All clients                              |
| Client Profiles         | Yes    | Profile review queue                     |
| Tasks                   | Yes    | All tax record tasks                     |
| Client Preview          | Yes    | Review client info before approval       |
| Client Details          | Yes    | Full client information view             |
| Edit Client Profile     | Yes    | Edit client info sections                |
| Profile Update Review   | Yes    | Review profile update submissions        |
| Tax Record Task Details | Yes    | Task detail with workflow actions        |
| Task Requests           | Yes    | Task request list (review + create)      |
| Task Request Detail     | Yes    | Review / approve / reject a request      |
| Invoice Detail          | Yes    | View invoice details                     |
| Consultation Logs       | Yes    | Consultation log list                    |
| Consultation Log Detail | Yes    | Individual consultation log              |
| Notifications           | Yes    | Notification inbox                       |
| User Profile            | Yes    | Own profile settings                     |
| Help                    | Yes    | Help page                                |

### OOS (`/oos`)

| Page                    | Shared | Description                              |
|-------------------------|--------|------------------------------------------|
| Dashboard               | Yes    | Accountant dashboard                     |
| Tasks                   | Yes    | Own assigned tasks                       |
| Assigned Clients        | Yes    | Assigned clients                         |
| Client Onboarding       | No     | Onboarding queue                         |
| Client Offboarding      | No     | Offboarding queue                        |
| New Client (create)     | No     | Create new client profile                |
| New Client (edit)       | No     | Edit draft client profile                |
| Client Preview          | Yes    | Review client info                       |
| Client Snapshot         | No     | Frozen archive snapshot after handoff    |
| Client Details          | Yes    | Full client information view             |
| Edit Client Profile     | Yes    | Edit client info sections                |
| Profile Update Review   | Yes    | Review profile update submissions        |
| Tax Record Task Details | Yes    | Task detail with workflow actions        |
| Task Requests           | Yes    | Submit + track own task requests         |
| Task Request Detail     | Yes    | Track a submitted request's status       |
| Consultation Logs       | Yes    | Consultation log list                    |
| Consultation Log Detail | Yes    | Individual consultation log              |
| Notifications           | Yes    | Notification inbox                       |
| Accountant Analytics    | Yes    | Own analytics                            |
| User Profile            | Yes    | Own profile settings                     |
| Help                    | Yes    | Help page                                |

### QTD (`/qtd`)

| Page                    | Shared | Description                              |
|-------------------------|--------|------------------------------------------|
| QTD Dashboard           | No     | QTD-specific dashboard                   |
| Tasks                   | Yes    | Task management view                     |
| Assigned Clients        | Yes    | Assigned clients                         |
| Client Profiles         | Yes    | Profile review queue                     |
| Client Preview          | Yes    | Review client info for approval          |
| Client Details          | Yes    | Full client information view             |
| Profile Update Review   | Yes    | Review profile update submissions        |
| Tax Record Task Details | Yes    | Task detail with workflow actions        |
| Task Requests           | Yes    | Task request review queue                |
| Task Request Detail     | Yes    | Review / approve / reject a request      |
| Consultation Logs       | Yes    | Consultation log list                    |
| Consultation Log Detail | Yes    | Individual consultation log              |
| Notifications           | Yes    | Notification inbox                       |
| User Profile            | Yes    | Own profile settings                     |
| Help                    | Yes    | Help page                                |

### CSD (`/csd`)

| Page                    | Shared | Description                              |
|-------------------------|--------|------------------------------------------|
| Dashboard               | Yes    | Accountant dashboard                     |
| Tasks                   | Yes    | Own assigned tasks                       |
| Assigned Clients        | Yes    | Assigned clients                         |
| Client Details          | Yes    | Full client information view             |
| Edit Client Profile     | Yes    | Edit client info sections                |
| Profile Update Review   | Yes    | Review profile update submissions        |
| Tax Record Task Details | Yes    | Task detail with workflow actions        |
| Task Requests           | Yes    | Submit + track own task requests         |
| Task Request Detail     | Yes    | Track a submitted request's status       |
| Consultation Logs       | Yes    | Consultation log list                    |
| Consultation Log Detail | Yes    | Individual consultation log              |
| Notifications           | Yes    | Notification inbox                       |
| Accountant Analytics    | Yes    | Own analytics                            |
| User Profile            | Yes    | Own profile settings                     |
| Help                    | Yes    | Help page                                |

### Viewer (`/viewer`)

| Page                    | Shared | Description                              |
|-------------------------|--------|------------------------------------------|
| Client List             | Yes    | All clients (read-only)                  |
| Client Details          | Yes    | Profile, Tax Records, Consultations tabs (read-only) |
| User Profile            | Yes    | Own profile settings                     |
| Help                    | Yes    | Help page                                |

VIEWER is a shared read-only stakeholder account. The landing page is the client list -- there is no dashboard. Within `ClientDetails`, write-oriented UI is hidden: Edit Profile, Reassign, Change Status, Activate Account, Handoff, Offboarding actions, Client Notices, and the right-side Tasks/Billing widgets. The Tax Records tab (including versioned drill-down and bulk download) and Consultations tab are fully accessible.

Because VIEWER is shared, `position` can be `null`. The Add/Edit User modal hides the Position dropdown when the selected role is "Viewer", and `ManagedUser.position` / `CreateUserRequest.positionId` / `AccountantListItemResponse.position` / `AssignedAccountant.position` are all nullable. `NotificationsContext` skips the unread-count fetch for VIEWER, and `TopNav` hides the notification bell (same pattern as CLIENT and BILLING). `TopNav` already shows `user.name` rather than a first-name greeting, so the shared account is safe by default.

Key files: `src/features/viewer/layouts/ViewerLayout.tsx`, `src/router/viewerRoutes.tsx`, and the `isViewer` gates in `src/features/common/pages/ClientDetails/ClientDetails.tsx`.

### Billing (`/internal-billing`)

| Page                    | Shared | Description                              |
|-------------------------|--------|------------------------------------------|
| Clients                 | No     | Billing-specific client list             |
| Billings                | No     | Invoice list and management              |
| Create Invoice          | No     | Create new invoice                       |
| Invoice Detail          | Yes    | View invoice details                     |
| User Profile            | Yes    | Own profile settings                     |
| Help                    | Yes    | Help page                                |

### Client (`/client`)

| Page                    | Shared | Description                              |
|-------------------------|--------|------------------------------------------|
| Dashboard               | No     | Client-specific dashboard                |
| Profile                 | No     | View own client profile                  |
| Tax Records             | No     | View own tax records                     |
| Invoice List            | No     | View own invoices                        |
| Invoice Detail          | Yes    | View invoice details                     |
| Account Settings        | Yes    | Own profile settings                     |

## Route-Level Gating

Route access is enforced by `RoleGuard` (`src/guards/RoleGuard.tsx`). Each route group is wrapped with:

```tsx
<RoleGuard allowedRoles={[UserRole.MANAGER]} />
```

If a user's `roleKey` is not in the `allowedRoles` array, they are redirected to their own dashboard via `getDashboardUrl(user.roleKey)`.

## Component-Level Gating

Within shared pages, `hasPermission()` controls visibility of specific UI elements:

```ts
// Only Manager sees "Change Status" button on Client Details
if (hasPermission(user.permissions, Permission.CLIENT_MANAGE)) {
  // render Change Status button
}

// Only users with CLIENT_REASSIGN can reassign accountants
if (hasPermission(user.permissions, Permission.CLIENT_REASSIGN)) {
  // render Reassign Accountants button
}
```

Task-level actions (edit, submit, approve, reject, etc.) are controlled by server-computed `TaskActions` flags on the task detail response, not by frontend permission checks. The backend considers the user's role, assignment, and task status to compute 11 boolean action flags (`canEdit`, `canSubmit`, `canApprove`, `canReject`, etc.).

## VIEWER Role Permissions

VIEWER holds exactly four permissions, all of which already exist for other roles:

- `client.view.all`
- `client_info.view.all`
- `tax_records.view.all`
- `consultation.view.all`

No new permission constants were introduced. VIEWER relies on existing gates throughout the UI; additional `roleKey === UserRole.VIEWER` checks are added only where a parent component would otherwise mount a child that fires a write-oriented or tasks/billing fetch (which would 403).
