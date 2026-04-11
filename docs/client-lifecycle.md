# Client Lifecycle

This document covers the full client journey in the tax records portal, from onboarding through active engagement to offboarding.

## Client Statuses

There are four client statuses:

| Status            | Description                                      |
| ----------------- | ------------------------------------------------ |
| ONBOARDING        | Client profile is being created and reviewed     |
| ACTIVE_CLIENT     | Client is fully onboarded and receiving services  |
| OFFBOARDING       | Client is in the process of disengagement        |
| INACTIVE_CLIENT   | Client engagement has ended                      |

**Status transition rules:**

- Transitions are **Manager-only** (permission: `CLIENT_MANAGE` / `client.manage`).
- Transitions are **free-form** -- any status can move to any other status.
- Endpoint: `PATCH /clients/{clientId}/status` with body `{ status: ClientStatus }` returns 204.

---

## Lifecycle Flow

```
                          +--------------------+
                          |    OOS creates     |
                          |    new client      |
                          +---------+----------+
                                    |
                                    v
                          +--------------------+
                          |    ONBOARDING      |
                          |                    |
                          | - Fill 7 sections  |
                          | - Submit for review|
                          | - Review cycle     |
                          | - Activate account |
                          | - Handoff          |
                          +---------+----------+
                                    |
                          Manager changes status
                                    |
                                    v
                          +--------------------+
                          |   ACTIVE_CLIENT    |
                          |                    |
                          | - Profile updates  |
                          | - Tax record tasks |
                          | - Consultations    |
                          +---------+----------+
                                    |
                          Manager changes status
                                    |
                                    v
                          +--------------------+
                          |   OFFBOARDING      |
                          |                    |
                          | - Engagement letter|
                          | - Protect records  |
                          | - Deactivate accts |
                          +---------+----------+
                                    |
                          Auto or Manager change
                                    |
                                    v
                          +--------------------+
                          |  INACTIVE_CLIENT   |
                          +--------------------+
```

Note: Because transitions are free-form, any status can move to any other. The diagram above represents the typical happy path.

---

## Onboarding Flow

### Step-by-step

1. **OOS creates new client** -- client starts in `ONBOARDING` status.
2. **OOS fills 7 profile sections:**
   - Main Details
   - Client Info
   - Officers
   - Credentials
   - Scope of Engagement
   - Professional Fees
   - Onboarding Info
3. **OOS submits profile for review** -- creates a task of type `ONBOARDING`.
4. **QTD or Manager reviews** -- approve or reject with comment.
5. **If rejected** -- OOS corrects and resubmits. The review cycle repeats until approved.
6. **On approval** -- profile becomes live data, `isProfileApproved` flag is set on the client.
7. **OOS creates client portal account** -- sends activation email (counted as "Clients Activated").
8. **OOS performs handoff** -- in the handoff modal, picks the new CSD/OOS accountants (creator excluded from the list) and the QTD (pre-populated with the current QTD, re-pickable). On submit, the creator OOS is removed and replaced with the chosen accountants, and a frozen archive snapshot is created.
9. **Manager sets status to ACTIVE_CLIENT**.

### Review cycle diagram

```
OOS submits profile
        |
        v
  +------------+      reject       +--------------+
  |  QTD/Mgr   | ----------------> |  OOS fixes   |
  |  reviews   |                   |  & resubmits |
  +-----+------+                   +------+-------+
        |                                 |
     approve                              |
        |            (cycle repeats) <----+
        v
  isProfileApproved = true
```

---

## Profile Approval vs. Client Status

These two concepts are **decoupled**:

- Approving a profile does **not** change client status.
- The `isProfileApproved` flag is set independently of the status field.
- Preview page action cards are gated on `isProfileApproved`, **not** on status:

| Action Card         | Visibility Condition                          |
| ------------------- | --------------------------------------------- |
| ActivateAccountCard | `isProfileApproved` (always -- multiple accounts allowed) |
| HandoffCard         | `isProfileApproved && !handedOff`             |

---

## Handoff

- **Endpoint:** `POST /clients/{clientId}/handoff`
- **Body:** `{ csdOosAccountantIds: string[], qtdAccountantId: string }`. `csdOosAccountantIds` must be non-empty and must NOT include the client's `creatorId` — the handoff modal filters the picker on `header.creatorId`, and the backend validates server-side too.
- **Initial accountant state:** when a client is created via `POST /clients`, the backend auto-assigns the calling OOS as the sole CSD/OOS accountant. The QTD is set later via the `mainDetails` PATCH (which accepts `qtdAccountantId` and routes it to the accountants join).
- **What handoff does:**
  - Replaces the creator OOS with the chosen CSD/OOS accountants and the chosen QTD on the `client.accountants` join.
  - Creates a frozen archive snapshot of the client profile, capturing state at the moment of handoff.
- **What it does NOT do:** transition client status. Status changes remain Manager-only.
- **After handoff:**
  - OOS sees the frozen snapshot (route: `/oos/client-snapshot/:id`), unless also assigned as an accountant.
  - Routing is based on the `isHandedOff` flag, not on status.

---

## Active Client -- Profile Updates

Once a client is active, assigned accountants can request profile changes:

1. Accountant submits a profile update request -- creates a `PROFILE_UPDATE` task.
2. QTD or Manager reviews a side-by-side diff (current vs. proposed).
3. **On approval:** all 7 JSONB sections overwrite atomically (`@Transactional`).
4. **On rejection:** accountant can revise and resubmit.

**Constraints:**

- Only one pending profile update per client at a time. Attempting a second returns HTTP 409.
- Profile updates do **not** change client status.

---

## Offboarding

### Initiation

When a Manager changes a client's status to `OFFBOARDING`, additional fields are required:

| Field                    | Required | Description                              |
| ------------------------ | -------- | ---------------------------------------- |
| Assigned OOS accountant  | Yes      | Accountant responsible for offboarding   |
| End of engagement date   | Yes      | Date the engagement formally ends        |
| Deactivation date        | No       | Date for automatic account deactivation  |

### Offboarding process

After initiation, the following actions become available:

- **Offboarding banner** is displayed on the client details page.
- **Send end-of-engagement letter** -- email template sent to all linked users regardless of their account status.
- **Toggle tax records protection** -- blocks ALL file downloads for client portal users. Internal users are unaffected.
- **Deactivate individual client portal accounts** -- manual per-account deactivation.

### Auto-deactivation

A daily cron job runs at midnight (Asia/Manila timezone). On the deactivation date, it:

1. Deactivates all client portal accounts linked to the client.
2. Sets the client status to `INACTIVE_CLIENT`.

---

## Account Activation

Client portal accounts are created and managed as follows:

- `POST` creates a new `User` with the `CLIENT` role, linked to the client entity.
- An activation email is sent containing a password-set link.
- **Resending activation** does not create a new user -- it updates the existing record and resends the email.
- **Multiple accounts per client are allowed.** The ActivateAccountCard is always shown when `isProfileApproved` is true, regardless of how many accounts already exist.

---

## Key API Endpoints

| Method | Endpoint                           | Description                              | Response |
| ------ | ---------------------------------- | ---------------------------------------- | -------- |
| PATCH  | `/clients/{clientId}/status`       | Change client status (Manager only)      | 204      |
| POST   | `/clients/{clientId}/handoff`      | Perform handoff                          | 201      |
| GET    | `/clients/{id}/info`               | Client info header (nested structure)    | 200      |
| GET    | `/clients/{id}/info/sections/{key}`| Lazy-load individual profile section     | 200      |

---

## Key Flags on ClientInfoHeaderResponse

| Flag                | Type    | Purpose                                                  |
| ------------------- | ------- | -------------------------------------------------------- |
| `isProfileApproved` | boolean | Gates account activation and handoff actions             |
| `handedOff`         | boolean | Controls routing (snapshot vs. live) and HandoffCard     |
| `status`            | string  | Current client status (one of the four values above)     |
