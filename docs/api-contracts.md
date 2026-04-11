# API Contracts

## Base Configuration

- **Base URL**: `VITE_API_BASE_URL` env var + `/api/v1`
- **Auth**: Bearer token in `Authorization` header (Axios request interceptor)
- **Token refresh**: Automatic on 401/403 via `POST /auth/refresh` with `{ refreshToken }`. Deduplicates concurrent refresh calls.
- **Deactivated accounts**: 403 with message `"Your account has been deactivated."` redirects to login without refresh attempt.
- **Rate limiting**: 429 responses are not retried or refreshed.
- **Default timeout**: 10,000ms
- **Error format**: `{ message: string, errors?: Record<string, string> }`
- **Status code conventions**: 201 for creation, 204 for status transitions and deletes

---

## Auth

Source: `src/api/auth.ts`

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| POST | `/auth/login` | Login | `LoginRequest` | `LoginResponse` |
| POST | `/auth/forgot-password` | Request password reset email | `{ email }` | void |
| POST | `/auth/reset-password` | Reset password with token | `{ token, newPassword }` | `LoginResponse` |
| POST | `/auth/logout` | Logout | `{ refreshToken }` | void |
| POST | `/auth/refresh` | Refresh access token | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| POST | `/auth/set-password` | Set password during account activation | `SetPasswordRequest` | `LoginResponse` |

---

## Users

Source: `src/api/users.ts`

| Method | Path | Description | Params / Body | Response |
|--------|------|-------------|---------------|----------|
| GET | `/users/me` | Get current user's full profile | -- | `MyProfileResponse` |
| PATCH | `/users/me` | Update current user's profile | `UpdateMyProfileRequest` | `UpdateMyProfileResponse` (includes `accessToken`) |
| POST | `/users/me/avatar` | Upload avatar | `multipart/form-data` (file) | `{ profileUrl, accessToken }` |
| DELETE | `/users/me/avatar` | Delete avatar | -- | `{ accessToken }` |
| POST | `/users/me/change-password` | Change password | `{ currentPassword, newPassword }` | void |
| GET | `/users` | List managed users | Query: `search`, `roleKey`, `status`, `position` | `ManagedUser[]` |
| POST | `/users` | Create user | `CreateUserRequest` | `ManagedUser` (201) |
| PATCH | `/users/{userId}` | Update user | `UpdateUserRequest` | `ManagedUser` |
| PATCH | `/users/{userId}/status` | Change user status | `{ status }` | void (204) |
| POST | `/users/{userId}/resend-activation` | Resend activation email | `{ firstName?, lastName?, email? }` | void |
| GET | `/users/accountants` | List accountants | Query: `roleKey` (optional) | `AccountantListItemResponse[]` |
| GET | `/users/client/{clientId}` | Get client accounts | -- | `ClientAccountResponse[]` |
| GET | `/tokens/verify/activation-token` | Validate activation token | Query: `token` | `ActivateAccountResponse` |

---

## Roles

Source: `src/api/role.ts`

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/roles/employees` | List employee roles | `RoleListItem[]` |

---

## Employee Positions

Source: `src/api/users.ts`

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| GET | `/employee-positions` | List positions | -- | `PositionListItem[]` |
| POST | `/employee-positions` | Create position | `{ name }` | `PositionListItem` (201) |

---

## Clients

Source: `src/api/client.ts`

### Client CRUD & Status

| Method | Path | Description | Params / Body | Response |
|--------|------|-------------|---------------|----------|
| GET | `/clients` | Paginated client list | Query: `page`, `size`, `search` | `ClientPageResponse` |
| GET | `/clients/active` | Active clients lookup (Manager: all; QTD/OOS/CSD: assigned only) | -- | `LookupResponse[]` |
| GET | `/clients/{clientId}/accountants` | Accountants assigned to a client | -- | `ClientAccountantResponse[]` |
| GET | `/clients/assigned` | Current user's assigned clients | Query: `page`, `size` | `AssignedClientsResponse` |
| POST | `/clients` | Create new client (OOS) — backend auto-assigns the creating OOS as the sole initial accountant | -- | `CreateClientResponse` (201) |
| DELETE | `/clients/{clientId}` | Delete client draft | -- | void (204) |
| PATCH | `/clients/{clientId}/status` | Change client status (Manager only) | `{ status }` | void (204) |
| GET | `/clients/{clientId}/summary` | Client summary card data | -- | `ClientSummaryResponse` |

### Onboarding & Offboarding Lists

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/clients/onboarding` | OOS onboarding clients | Query: `search` | `ClientOnboardingListItemResponse[]` |
| GET | `/clients/offboarding` | OOS offboarding clients | -- | `ClientOffboardingListItemResponse[]` |

### Client Info (Header + Sections)

| Method | Path | Description | Params / Body | Response |
|--------|------|-------------|---------------|----------|
| GET | `/clients/info-template` | Full info template (create mode) | -- | `ClientInfoResponse` |
| GET | `/clients/{clientId}/info` | Client info header (includes `creatorId`) | -- | `ClientInfoHeaderResponse` |
| GET | `/clients/{clientId}/info/{sectionKey}` | Single section data — `mainDetails` does NOT include accountant fields (read accountants from `/clients/{id}/summary` or header) | -- | `ClientInfoSections[K]` |
| PATCH | `/clients/{clientId}/info/{sectionKey}` | Update section — `mainDetails` body still accepts `qtdAccountantId` (backend routes it to the accountants join, keeping the creator OOS); `csdOosAccountantIds` is no longer accepted | section data | void |
| GET | `/clients/validate-mre-code` | Validate MRE code format + uniqueness | Query: `code` (required), `clientId` (optional UUID — pass when editing to exclude own record) | `{ isValid: boolean }` |

### Client Info (Client-facing "me" endpoints)

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/clients/me/info` | Current client's info header | `ClientInfoHeaderResponse` |
| GET | `/clients/me/info/{sectionKey}` | Current client's section data | `ClientInfoSections[K]` |
| GET | `/clients/me/notices` | Current client's notices | `ClientNoticeResponse[]` |
| GET | `/clients/me/engagement-letter-exists` | Check for engagement letter | `{ exists }` |
| GET | `/clients/me/engagement-letters` | List engagement letters | `{ id, name }[]` |

### Client Info Review Tasks

| Method | Path | Description | Params / Body | Response |
|--------|------|-------------|---------------|----------|
| GET | `/client-info/tasks/reviews` | Profile review list | Query: `ProfileReviewFilters` | `ProfileReviewPageResponse` |
| GET | `/client-info/tasks/{taskId}` | Get info task detail | -- | `ClientInfoTaskResponse` |
| GET | `/client-info/tasks/{taskId}/profile-update-review` | Profile update review diff | -- | `ProfileUpdateReviewResponse` |
| POST | `/client-info/tasks/{clientId}/submit` | Submit for review | `{ comment? }` | void |
| POST | `/client-info/tasks/{clientId}/submit-update` | Submit profile update | sections + `{ comment? }` | void |
| POST | `/client-info/tasks/{taskId}/approve` | Approve client info | `{ comment }` | void |
| POST | `/client-info/tasks/{taskId}/reject` | Reject client info | `{ comment }` | void |
| GET | `/client-info/tasks/{taskId}/logs` | Info task activity logs | -- | `ClientInfoTaskLogResponse[]` |
| GET | `/client-info/tasks/{taskId}/logs/{logId}/comment` | Log comment (rich text) | -- | `LogCommentResponse` |

### Handoff & Archive

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| POST | `/clients/{clientId}/handoff` | Handoff client — replaces creator OOS with the chosen accountants. `csdOosAccountantIds` must be non-empty and must NOT include the client's creator. Errors: 400 if creator included, ID is wrong role, client already handed off, or no onboarding profile exists | `{ csdOosAccountantIds: string[], qtdAccountantId: string }` | void |
| GET | `/clients/{clientId}/archive-snapshot` | Archive snapshot (OOS post-handoff) — captures client state at the moment of handoff | -- | `ArchiveSnapshotResponse` |

### Account Activation

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| POST | `/clients/{clientId}/activate` | Activate client account | `ActivateClientAccountPayload` | void |

### Accountant Reassignment

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| PUT | `/clients/{clientId}/assigned-accountants` | Reassign accountants | `{ csdOosAccountantIds, qtdAccountantId }` | void |

### Notices

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| GET | `/clients/{clientId}/notices` | List notices | -- | `ClientNoticeResponse[]` |
| POST | `/clients/{clientId}/notices` | Create notice | `CreateClientNoticeRequest` | `ClientNoticeResponse` (201) |
| DELETE | `/clients/{clientId}/notices/{noticeId}` | Delete notice | -- | void (204) |

### Offboarding

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| POST | `/clients/{clientId}/offboard` | Start offboarding | `OffboardClientRequest` | void |
| PATCH | `/clients/{clientId}/tax-records-protection` | Toggle tax records protection | `{ protectTaxRecords }` | void |
| POST | `/clients/{clientId}/send-end-of-engagement-letter` | Send engagement letter | `{ templateId }` | void |

### End of Engagement Letter Templates

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| GET | `/end-of-engagement-letter-templates` | List templates | -- | `EndOfEngagementLetterTemplateSummary[]` |
| GET | `/end-of-engagement-letter-templates/{id}` | Get template | -- | `EndOfEngagementLetterTemplate` |
| POST | `/end-of-engagement-letter-templates` | Create template | `{ name, body }` | `EndOfEngagementLetterTemplate` (201) |
| PUT | `/end-of-engagement-letter-templates/{id}` | Update template | `{ name, body }` | `EndOfEngagementLetterTemplate` |
| DELETE | `/end-of-engagement-letter-templates/{id}` | Delete template | -- | void (204) |

---

## Tax Record Tasks

Source: `src/api/tax-record-task.ts`

### Task Lists

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/tax-record-tasks` | Paginated task list | Query: `TaxRecordTaskFilters` (via `buildParams`) | `TaxRecordTaskPageResponse` |
| GET | `/tax-record-tasks/overdue` | Overdue tasks (paginated) | Query: `page`, `size` | `TaxRecordTaskOverduePageResponse` |
| GET | `/tax-record-tasks/rejected` | Rejected tasks (paginated) | Query: `page`, `size` | `TaxRecordTaskRejectedPageResponse` |
| GET | `/tax-record-tasks/reviewer-queue` | Reviewer pending queue | -- | `ReviewerQueueItemResponse[]` |
| GET | `/tax-record-tasks/recently-decided` | Recently decided by reviewer | -- | `ReviewerDecidedItemResponse[]` |
| GET | `/tax-record-tasks/todo` | Accountant to-do list | Query: `page`, `size` | `TaxRecordTaskTodoListPageResponse` |
| GET | `/tax-record-tasks/submitted` | Submitted tasks | Query: `page`, `size` | `TaxRecordTaskProgressPageResponse` |
| GET | `/tax-record-tasks/for-filing` | Approved for filing | Query: `page`, `size` | `TaxRecordTaskProgressPageResponse` |
| GET | `/tax-record-tasks/filed` | Filed tasks | Query: `page`, `size` | `TaxRecordTaskProgressPageResponse` |
| GET | `/tax-record-tasks/client/{clientId}` | Client's tasks (cursor-based) | Query: `cursor` | `ClientTaxRecordTaskPageResponse` |

### Task CRUD

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| POST | `/tax-record-tasks` | Create single task | `CreateTaxRecordTaskRequest` (`assignedToIds: UUID[]`) | `CreateTaxRecordTaskResponse` (201) |
| POST | `/tax-record-tasks/bulk` | Bulk import tasks | `BulkImportItem[]` | `BulkImportResponse` |
| GET | `/tax-record-tasks/bulk-template` | Download bulk template | -- | blob (xlsx) |
| GET | `/tax-record-tasks/{id}` | Get task detail | -- | `TaxRecordTaskDetailResponse` |
| DELETE | `/tax-record-tasks/{id}` | Delete task | -- | void (204) |

### Task Workflow Actions

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| POST | `/tax-record-tasks/{id}/submit` | Submit for review | `{ comment }` | void |
| POST | `/tax-record-tasks/{id}/approve` | Approve task | `{ comment }` | void |
| POST | `/tax-record-tasks/{id}/reject` | Reject task | `{ comment }` | void |
| POST | `/tax-record-tasks/{id}/mark-filed` | Mark as filed | -- | void |
| POST | `/tax-record-tasks/{id}/mark-completed` | Mark as completed | -- | void |
| POST | `/tax-record-tasks/{id}/recall` | Recall submission | -- | void |

### Task Files

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| GET | `/tax-record-tasks/{id}/files` | Get task files | -- | `TaxRecordTaskFilesResponse` |
| POST | `/tax-record-tasks/{id}/working-files` | Upload working file | `multipart/form-data` | `WorkingFileItem` |
| POST | `/tax-record-tasks/{id}/working-links` | Add working link | `{ url, label }` | `WorkingFileItem` |
| DELETE | `/tax-record-tasks/{taskId}/working-files/{workingFileId}` | Delete working file | -- | void (204) |
| PUT | `/tax-record-tasks/{id}/output-file` | Upload/replace output file | `multipart/form-data` | void |
| DELETE | `/tax-record-tasks/{id}/output-file` | Delete output file | -- | void (204) |
| PUT | `/tax-record-tasks/{id}/proof-of-filing` | Upload/replace proof of filing | `multipart/form-data` | void |
| DELETE | `/tax-record-tasks/{id}/proof-of-filing` | Delete proof of filing | -- | void (204) |

### Task Logs

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/tax-record-tasks/{id}/logs` | Activity logs | `TaxRecordTaskLogResponse[]` |
| GET | `/tax-record-tasks/{taskId}/logs/{logId}/comment` | Log comment (rich text) | `LogCommentResponse` |

### Lookup Hierarchy (Categories / Sub-Categories / Task Names)

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| GET | `/tax-record-categories` | List categories | -- | `TaxRecordLookupResponse[]` |
| POST | `/tax-record-categories` | Create category | `{ name }` | `TaxRecordLookupResponse` (201) |
| DELETE | `/tax-record-categories/{id}` | Delete category | -- | void (204) |
| GET | `/tax-record-categories/{categoryId}/sub-categories` | List sub-categories | -- | `TaxRecordLookupResponse[]` |
| POST | `/tax-record-categories/{categoryId}/sub-categories` | Create sub-category | `{ name }` | `TaxRecordLookupResponse` (201) |
| DELETE | `/tax-record-categories/{categoryId}/sub-categories/{subCategoryId}` | Delete sub-category | -- | void (204) |
| GET | `/tax-record-sub-categories/{subCategoryId}/task-names` | List task names | -- | `TaxRecordLookupResponse[]` |
| POST | `/tax-record-sub-categories/{subCategoryId}/task-names` | Create task name | `{ name }` | `TaxRecordLookupResponse` (201) |
| DELETE | `/tax-record-sub-categories/{subCategoryId}/task-names/{taskNameId}` | Delete task name | -- | void (204) |

### Legacy Task Names

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/tax-task-names` | Flat task name list | `TaxTaskNameResponse[]` |

---

## Tax Records

Source: `src/api/tax-record.ts`

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/tax-records/me/drill-down` | Drill-down for current user | Query: `DrillDownFilters` (via `buildParams`) | `DrillDownResponse` |
| GET | `/tax-records/client/{clientId}/drill-down` | Drill-down for specific client | Query: `DrillDownFilters` (via `buildParams`) | `DrillDownResponse` |
| GET | `/tax-records/me/recent` | Recent entries | Query: `range` (default `"7d"`) | `RecentTaxRecordEntryResponse[]` |
| GET | `/tax-records/me/important-dates` | Important dates | -- | `ImportantDateResponse[]` |

---

## Files

Source: `src/api/file.ts`

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| GET | `/files/{fileId}/preview` | Preview/download file | -- | blob |
| POST | `/clients/{clientId}/files` | Upload client file | `multipart/form-data` | `{ id, name }` |
| DELETE | `/files/{fileId}` | Delete file | -- | void (204) |
| POST | `/files/images` | Upload image (rich text) | `multipart/form-data` | `{ id, url }` |
| DELETE | `/files/images/{imageId}` | Delete image | -- | void (204) |

---

## Notifications

Source: `src/api/notification.ts`

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/notifications/mine` | Get notifications (paginated) | Query: `page`, `size` (fixed 15), `unread` (boolean) | `NotificationScrollResponse` |
| GET | `/notifications/unread-count` | Unread count | -- | `UnreadNotificationsCountResponse` |
| PATCH | `/notifications/{notificationId}/read` | Mark as read | -- | void |
| PATCH | `/notifications/mark-all-read` | Mark all as read | -- | void |
| DELETE | `/notifications/{notificationId}` | Delete notification | -- | void (204) |

---

## Invoices

Source: `src/api/invoice.ts`

### Billing Management (Internal)

| Method | Path | Description | Params / Body | Response |
|--------|------|-------------|---------------|----------|
| GET | `/invoices/clients` | Billing clients list | Query: `search`, `page`, `size` | `PageResponse<BillingClientListItemResponse>` |
| GET | `/invoices` | Invoice list | Query: `clientId`, `page`, `size`, `status`, `search` | `PageResponse<InvoiceListItemResponse>` |
| GET | `/invoices/{id}` | Invoice detail | -- | `InvoiceDetailResponse` |
| POST | `/invoices` | Create invoice | `CreateInvoicePayload` | `InvoiceDetailResponse` (201) |
| DELETE | `/invoices/{id}` | Delete invoice | -- | void (204) |
| PATCH | `/invoices/{id}/void` | Void invoice | -- | void (204) |
| POST | `/invoices/{id}/send-email` | Send invoice email | -- | void |

### Invoice Terms

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| GET | `/invoice-terms` | List terms | -- | `InvoiceTermResponse[]` |
| POST | `/invoice-terms` | Create term | `CreateTermPayload` | `InvoiceTermResponse` (201) |

### Payments

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| POST | `/invoices/{invoiceId}/payments` | Record payment | `{ date, amount, attachments? }` | `InvoicePaymentResponse` |
| PUT | `/invoices/{invoiceId}/payments/{paymentId}` | Update payment | `{ date, amount, attachments? }` | `InvoicePaymentResponse` |
| POST | `/invoices/{invoiceId}/payments/{paymentId}/send-email` | Send payment receipt email | -- | void |

### Accountant-facing

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/invoices/client/{clientId}` | Client's invoices sidebar | Query: `page`, `size`, `filter` | `ClientInvoiceSidebarPageResponse` |

### Client-facing

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/invoices/me/outstanding` | My outstanding invoices | -- | `ClientOutstandingInvoice[]` |
| GET | `/invoices/me` | My invoice history | Query: `page`, `size` | `PageResponse<ClientInvoiceListItem>` |
| GET | `/invoices/me/{id}` | My invoice detail | -- | `InvoiceDetailResponse` |

---

## Consultation Logs

Source: `src/api/consultation.ts`

### Log CRUD & Workflow

| Method | Path | Description | Params / Body | Response |
|--------|------|-------------|---------------|----------|
| GET | `/consultation-logs` | List logs (filtered) | Query: `ConsultationLogFilters` (via `buildParams`) | `ConsultationLogPageResponse` |
| GET | `/consultation-logs/{id}` | Log detail | -- | `ConsultationLogDetail` |
| POST | `/consultation-logs` | Create log | `CreateConsultationLogRequest` | `ConsultationLogDetail` (201) |
| PUT | `/consultation-logs/{id}` | Update log | `UpdateConsultationLogRequest` | `ConsultationLogDetail` |
| DELETE | `/consultation-logs/{id}` | Delete log | -- | void (204) |
| POST | `/consultation-logs/{id}/submit` | Submit for approval | `{ comment? }` | void (204) |
| POST | `/consultation-logs/{id}/approve` | Approve log | `{ comment? }` | void (204) |
| POST | `/consultation-logs/{id}/reject` | Reject log | `{ comment? }` | void (204) |

### Audits

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/consultation-logs/{logId}/audits` | Audit trail | `ConsultationLogAuditListItem[]` |
| GET | `/consultation-logs/{logId}/audits/{auditId}/comment` | Audit comment | `LogCommentResponse` |

### Summaries

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/consultation-logs/client/{clientId}/summary` | Client monthly summary | Query: `year`, `month` | `ConsultationMonthlySummary` |
| GET | `/consultation-logs/me/summary` | My current summary | -- | `ConsultationMonthlySummary` |

### Consultation Config

| Method | Path | Description | Body | Response |
|--------|------|-------------|------|----------|
| GET | `/client-consultation-configs/{clientId}` | Get config | -- | `ConsultationConfig` |
| PUT | `/client-consultation-configs/{clientId}` | Upsert config | `UpsertConsultationConfigRequest` | `ConsultationConfig` |

---

## System Analytics (Manager Dashboard)

Source: `src/api/systemAnalytics.ts`

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/analytics/system` | System overview stats | -- | `SystemAnalyticsResponse` |
| GET | `/analytics/task-completion-trend` | Task completion trend | Query: `range` | `TaskCompletionTrendData` |
| GET | `/analytics/approval-rate` | Approval rate | Query: `range` | `TaskApprovalRateData` |
| GET | `/analytics/accountant-workload` | Accountant workload | -- | `AccountantWorkloadItem[]` |
| GET | `/analytics/tasks-by-category` | Tasks by category (system-wide) | -- | `TasksByCategorySystemItem[]` |
| GET | `/analytics/accountant-overview` | Accountant overview | -- | `AccountantOverviewItem[]` |

---

## Accountant Analytics

Source: `src/api/accountantAnalytics.ts`

### Current User ("me")

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/tax-record-tasks/dashboard-stats` | Dashboard stats | -- | `AccountantsDashboardAnalyticsResponse` |
| GET | `/tax-record-tasks/reviewer-dashboard-stats` | Reviewer dashboard stats | -- | `ReviewerDashboardStatsResponse` |
| GET | `/analytics/me/task-summary` | Task summary | -- | `TaskSummaryResponse` |
| GET | `/analytics/me/monthly-throughput` | Monthly throughput | Query: `months` (default 6) | `MonthlyThroughputResponse` |
| GET | `/analytics/me/on-time-rate` | On-time rate | -- | `OnTimeRateResponse` |
| GET | `/analytics/me/quality-metrics` | Quality metrics | -- | `QualityMetricsResponse` |
| GET | `/analytics/me/tasks-by-category` | Tasks by category | -- | `TasksByCategoryResponse` |
| GET | `/analytics/me/onboarding-pipeline` | Onboarding pipeline | -- | `OnboardingPipelineResponse` |
| GET | `/analytics/me/client-portfolio` | Client portfolio | Query: `page`, `size` | `ClientPortfolioResponse` |

### Manager Viewing Specific Accountant

| Method | Path | Description | Params | Response |
|--------|------|-------------|--------|----------|
| GET | `/analytics/users/{userId}/task-summary` | User task summary | -- | `TaskSummaryResponse` |
| GET | `/analytics/users/{userId}/monthly-throughput` | User monthly throughput | Query: `months` | `MonthlyThroughputResponse` |
| GET | `/analytics/users/{userId}/on-time-rate` | User on-time rate | -- | `OnTimeRateResponse` |
| GET | `/analytics/users/{userId}/quality-metrics` | User quality metrics | -- | `QualityMetricsResponse` |
| GET | `/analytics/users/{userId}/tasks-by-category` | User tasks by category | -- | `TasksByCategoryResponse` |
| GET | `/analytics/users/{userId}/onboarding-pipeline` | User onboarding pipeline | -- | `OnboardingPipelineResponse` |
| GET | `/analytics/users/{userId}/client-portfolio` | User client portfolio | Query: `page`, `size` | `ClientPortfolioResponse` |

---

## Key Response Types

### `ClientInfoHeaderResponse`

Nested structure with sub-objects:

- `displayName`, `taxpayerClassification`, `status`, `pocEmail`, `isProfileApproved`, `handedOff`
- `accountants: { csdOos, qtd }` -- assigned accountant info
- `taskReview: { hasActiveTask, activeTaskId, activeTaskType, lastReviewStatus }` -- current review state
- `offboarding: { accountantName, endOfEngagementDate, deactivationDate, taxRecordsProtected, endOfEngagementLetterSent }` -- offboarding state

### `TaxRecordTaskDetailResponse`

Includes `actions: TaskActions` -- 11 server-computed boolean flags:

`canEdit`, `canSubmit`, `canRecall`, `canApprove`, `canReject`, `canMarkFiled`, `canMarkCompleted`, `canUploadWorkingFiles`, `canUploadOutput`, `canUploadProof`, `canDelete`

Frontend derives: `canReview = canApprove || canReject`, `canEditProof = canUploadProof`.

### `FileItem`

`{ id: string, name: string }` -- no `url` field (was removed to prevent infrastructure path leaks).

### `ClientOutstandingInvoice`

Includes `isOverdue: boolean` -- server-computed, not derived on the frontend.

### Pagination Shapes

- **Offset-based**: `PageResponse<T> { content: T[], totalElements, totalPages, page, size }`
- **Scroll/infinite**: `ScrollResponse { content, hasMore }` -- used by notifications (page size 15)
- **Cursor-based**: `ClientTaxRecordTaskPageResponse` -- uses `cursor` query param

---

## Utility: `buildParams`

Source: `src/api/api-utils.ts`

```ts
function buildParams<T>(filters: T): Record<string, string | number>
```

Takes a filter object and returns a clean params record:

- Skips `null`, `undefined`, and empty string (`""`) values
- Preserves `number` values as-is (including `0`)
- Converts everything else to `string`

Usage example:

```ts
const params = buildParams({ search: "acme", status: "", page: 0, roleKey: null });
// Result: { search: "acme", page: 0 }
```

Used throughout the API layer for all filtered/searchable endpoints.
