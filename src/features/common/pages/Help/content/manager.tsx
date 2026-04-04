import {
  LayoutDashboard,
  Users,
  BarChart3,
  Building2,
  UserCheck,
  ClipboardList,
  Bell,
  UserCircle,
  FileText,
  Settings,
  MessageSquareText,
  Upload,
} from "lucide-react";
import { P, Heading, Steps, BulletList, StatusTable, Tip } from "./shared";
import type { HelpSection } from "../types";

export const managerSections: HelpSection[] = [
  // ─── Dashboard ───
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "System-wide metrics and charts at a glance",
    icon: LayoutDashboard,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    content: (
      <>
        <P>
          The dashboard gives you a bird's-eye view of the entire system. Eight
          stat cards at the top provide key metrics, and four charts below give
          you deeper insight into trends and distribution.
        </P>

        <Heading>Client Portfolio (Card 1)</Heading>
        <P>
          Total clients in the system broken down by status: Onboarding,
          Active, Offboarding, and Inactive. This is an all-time snapshot —
          every client ever created, with no date filter applied.
        </P>

        <Heading>Task Pipeline (Card 2)</Heading>
        <P>
          All tasks system-wide grouped by status: Open, Submitted, Rejected,
          Approved for Filing, Filed, and Completed. Includes all-time tasks,
          not filtered by date.
        </P>

        <Heading>Overdue & Upcoming (Card 3)</Heading>
        <P>
          Tasks that need attention based on urgency. Only counts tasks in Open
          or Rejected status — these are the statuses where the ball is with
          the accountant. Submitted tasks are with the reviewer, so they're
          excluded.
        </P>
        <BulletList
          items={[
            "Overdue — the deadline has already passed.",
            "Due Today — the deadline falls within today.",
            "Due This Week — the deadline falls within the next 7 days (includes today).",
          ]}
        />

        <Heading>Review Queue (Card 4)</Heading>
        <P>
          Client info profiles currently pending review, broken down by type:
        </P>
        <BulletList
          items={[
            "Onboarding Profiles Pending — new clients whose OOS submitted their profile for the first time.",
            "Profile Updates Pending — existing active clients who submitted changes to their information.",
          ]}
        />

        <Heading>Monthly Activity (Card 5)</Heading>
        <P>Activity since the 1st of the current month:</P>
        <BulletList
          items={[
            "Tasks Completed This Month — tasks that reached the Completed status.",
            "Tasks Created This Month — new tasks created during this month.",
            "Tasks Rejected This Month — counts rejection events, not distinct tasks. A task rejected twice in the same month counts as 2.",
          ]}
        />

        <Heading>Efficiency (Card 6)</Heading>
        <P>How fast work is getting done across the system.</P>
        <BulletList
          items={[
            "Avg Completion Time — average calendar days from task creation to completion (includes weekends and holidays). Same-day completions show as fractional values. Includes every completed task ever.",
            "On-Time Rate — all-time percentage of completed tasks where the completion happened on or before the deadline.",
          ]}
        />

        <Heading>Quality (Card 7)</Heading>
        <P>How clean submissions are across the system.</P>
        <BulletList
          items={[
            "First-Attempt Approval Rate — percentage of tasks submitted at least once that had zero rejections — not limited to approved tasks, includes any task ever submitted.",
            "Avg Rejection Cycles — all-time average number of rejections per submitted task, including tasks with zero rejections. This includes zero-rejection tasks in the average, giving an overall quality signal across the system.",
          ]}
        />

        <Heading>Onboarding Funnel (Card 8)</Heading>
        <P>
          Tracks the client activation pipeline for the current month:
        </P>
        <BulletList
          items={[
            "Onboarding Clients — same count as Card 1 (clients currently in Onboarding status).",
            "Profiles Pending Review — same count as Card 4's onboarding number.",
            "Clients Activated This Month — counts client portal accounts created since the 1st. Each client account is counted once — resending the activation email does not create a new count.",
          ]}
        />

        <Heading>Charts</Heading>
        <BulletList
          items={[
            "Task Completion Trend — line chart showing task completions over time. The 7-day view shows 7 daily points, 1-month shows 30 daily points, and 3-month shows 13 weekly points (Monday-start weeks).",
            "Task Approval Rate — donut chart showing the ratio of approved vs. rejected review decisions. Counts individual decisions — a task rejected 3 times then approved counts as 4 decisions (3 rejected + 1 approved).",
            "Accountant Workload — top 5 CSD and OOS accountants by active task count (all statuses except Completed). Click \"View all\" to go to the Accountant Analytics page.",
            "Tasks by Category — stacked bar chart showing task distribution across categories, broken down by status.",
          ]}
        />
      </>
    ),
  },

  // ─── User Management ───
  {
    id: "users",
    title: "User Management",
    subtitle: "Create internal users and manage accounts",
    icon: Users,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    content: (
      <>
        <P>
          The User Management page lets you create internal user accounts,
          edit their details, and manage their account status.
        </P>

        <Heading>Creating a User</Heading>
        <Steps
          items={[
            "Click the Add User button.",
            "Fill in their first name, last name, and email address.",
            "Select their role (OOS, CSD, QTD, or Internal Accounting).",
            "Optionally select a position (e.g., \"Jr. Accountant III\"). You can create a new position inline if it doesn't exist yet.",
            "Add any professional titles (prefix or suffix) if applicable.",
            "Click Create — the user will receive an activation email with a link to set their password.",
          ]}
        />

        <Heading>Editing a User</Heading>
        <P>
          Click the edit icon on any active or deactivated user to update their
          details. You can change their first name, last name, email, role,
          position, and titles.
        </P>

        <Heading>Resending Activation</Heading>
        <P>
          For users who haven't activated their account yet (Pending status),
          click the send icon to resend the activation email. You can update
          their first name, last name, or email address before resending in
          case there was a typo during creation.
        </P>

        <Heading>Deactivating & Reactivating Users</Heading>
        <P>
          Click the power icon on any active user to deactivate their account.
          Deactivated users can no longer log in and will be immediately signed
          out if they have an active session. You can reactivate a deactivated
          user at any time using the same button.
        </P>

        <Heading>User Table</Heading>
        <P>
          The table shows all users with their name, email, role, position, and
          account status. Use the search bar and filters (role, position,
          status) to find specific users. The available actions depend on the
          user's status:
        </P>
        <BulletList
          items={[
            "Pending — resend activation email (with optional detail edits).",
            "Active — edit details or deactivate the account.",
            "Deactivated — edit details or reactivate the account.",
          ]}
        />
      </>
    ),
  },

  // ─── Accountant Analytics ───
  {
    id: "accountant-analytics",
    title: "Accountant Analytics",
    subtitle: "View individual accountant performance",
    icon: BarChart3,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    content: (
      <>
        <P>
          This page shows all CSD and OOS accountants as cards, each displaying
          their active task count, assigned clients, and overdue tasks at a
          glance. Click any card to drill into their full performance
          analytics.
        </P>

        <Heading>Accountant Cards</Heading>
        <P>
          Each card shows the accountant's name, position, role, and three key
          metrics: active tasks, assigned clients, and overdue tasks. Overdue
          counts are highlighted in red when greater than zero. Use the search
          bar to filter by name or position.
        </P>

        <Heading>Individual Analytics — Stat Cards</Heading>
        <P>
          After clicking a card, you'll see the same analytics that CSD and
          OOS users see on their own "My Analytics" page, scoped to that
          accountant.
        </P>

        <Heading>Task Pipeline</Heading>
        <P>
          A snapshot of all tasks assigned to the accountant, grouped by
          status: Open, Submitted, Rejected, Approved for Filing, Filed, and
          Completed.
        </P>

        <Heading>Deadlines</Heading>
        <P>
          How many tasks need the accountant's attention based on urgency. Only
          counts tasks in Open or Rejected status — Submitted tasks are with
          the reviewer, so they're excluded.
        </P>
        <BulletList
          items={[
            "Overdue — the deadline has already passed.",
            "Due Today — the deadline falls within today.",
            "Due This Week — the deadline falls within the next 7 days (includes today).",
          ]}
        />

        <Heading>Productivity</Heading>
        <P>What the accountant has accomplished this month.</P>
        <BulletList
          items={[
            "Completed This Month — distinct tasks completed since the 1st of the month.",
            "Submitted This Month — distinct tasks submitted for review. Resubmissions of the same task don't inflate this number.",
            "New Tasks This Month — tasks assigned to them that were created since the 1st.",
          ]}
        />

        <Heading>Efficiency</Heading>
        <P>How fast the accountant closes out work.</P>
        <BulletList
          items={[
            "On-Time Rate — percentage of completed tasks where the completion happened on or before the deadline.",
            "Avg Completion Days — average number of days from task creation to completion, across all tasks they've completed.",
          ]}
        />

        <Heading>Quality</Heading>
        <P>How clean their submissions are when sent for review.</P>
        <BulletList
          items={[
            "First-Attempt Approval Rate — percentage of approved tasks that had zero rejections (approved on the first try).",
            "Avg Rejection Cycles — for tasks that were rejected at least once, the average number of times they were rejected before approval. Tasks approved on the first attempt are excluded. A value of 1.0 means rejections are resolved in one revision; 3.0+ suggests repeated back-and-forth.",
          ]}
        />

        <Heading>Responsiveness</Heading>
        <P>How quickly the accountant acts on assigned work.</P>
        <BulletList
          items={[
            "Avg Days to First Submit — average days between task creation and their first submission. Measures how quickly they pick up new work.",
            "Avg Rejection Turnaround — average days between a reviewer's rejection and their next resubmission. Measures how quickly they address feedback. Recalled-then-resubmitted gaps are excluded since those are voluntary pull-backs, not rejections.",
          ]}
        />

        <Heading>Workload</Heading>
        <P>The accountant's current capacity at a glance.</P>
        <BulletList
          items={[
            "Active Task Count — total non-completed tasks assigned to them (open + submitted + rejected + approved for filing + filed).",
            "Assigned Client Count — distinct clients that have at least one active task assigned to this accountant.",
          ]}
        />

        <Heading>Monthly Trend</Heading>
        <P>
          Month-over-month direction. Compares completed tasks this month
          against last month and shows the percentage change. Positive means
          improving, negative means slipping.
        </P>

        <Heading>Charts</Heading>
        <BulletList
          items={[
            "Tasks by Category — how their work is distributed across tax categories, split by active vs. completed.",
            "Monthly Throughput — completed tasks over time with an adjustable range (3, 6, or 12 months).",
            "On-Time Rate — visual donut chart showing on-time vs. late completions.",
            "Quality Metrics — total submissions, first-attempt approvals, approval rate, and average rejection cycles.",
          ]}
        />

        <Heading>Client Portfolio</Heading>
        <P>
          A table at the bottom shows all clients assigned to the accountant
          with their status, total task count, pending and overdue numbers, and
          nearest deadline. Click a client name to jump to their details page.
        </P>

        <Heading>Client Status Distribution</Heading>
        <P>
          For OOS accountants only — a donut chart showing the breakdown of
          their clients by status: Onboarding, Active, Offboarding, and
          Inactive. The center displays the total client count.
        </P>
        <Tip>
          You can also navigate here from the Dashboard by clicking "View all"
          on the Accountant Workload chart, which shows the top 5 busiest
          accountants.
        </Tip>
      </>
    ),
  },

  // ─── Client List ───
  {
    id: "clients",
    title: "Client List",
    subtitle: "All clients in the system",
    icon: Building2,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    content: (
      <>
        <P>
          The Client List shows every client in the system. You can filter by
          status and search by name to find specific clients. The table shows
          each client's status, task counts (total, pending, overdue), and
          nearest deadline.
        </P>
        <Heading>Client Details</Heading>
        <P>
          Click a client to open their details page. You'll see their full
          profile organized into expandable sections, along with a task list
          and summary sidebar.
        </P>
        <Heading>Changing Client Status</Heading>
        <P>
          As a Manager, you're the only role that can change a client's status.
          On the client details page, use the "Change Status" button in the
          header to set the client's status. The four statuses are:
        </P>
        <StatusTable
          rows={[
            {
              status: "Onboarding",
              color: "bg-blue-50 text-blue-700",
              description:
                "Default status when a client is first created. The OOS is building their profile.",
            },
            {
              status: "Active Client",
              color: "bg-emerald-50 text-emerald-700",
              description:
                "The client is being actively serviced. Typically set after handoff is complete.",
            },
            {
              status: "Offboarding",
              color: "bg-amber-50 text-amber-700",
              description:
                "The client is winding down their engagement.",
            },
            {
              status: "Inactive Client",
              color: "bg-gray-100 text-gray-600",
              description:
                "The client is no longer active. No ongoing work.",
            },
          ]}
        />
        <Tip>
          Status transitions are free-form — you can set any status at any
          time. The statuses above describe the typical usage, but the system
          won't enforce a specific order.
        </Tip>
      </>
    ),
  },

  // ─── Client Profiles ───
  {
    id: "client-profiles",
    title: "Client Profiles",
    subtitle: "Review onboarding profiles and profile updates",
    icon: UserCheck,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    content: (
      <>
        <P>
          The Client Profiles page shows all profile submissions that are
          pending review or have been reviewed. There are two types:
        </P>
        <BulletList
          items={[
            "Onboarding — a new client's profile submitted by OOS for the first time.",
            "Profile Update — changes to an existing active client's profile submitted by an assigned accountant.",
          ]}
        />

        <Heading>Reviewing an Onboarding Profile</Heading>
        <Steps
          items={[
            "Click a profile with \"Onboarding\" type to open the preview page.",
            "Review all 7 sections of the client's information.",
            "Click Approve to accept the profile, or Reject with a comment explaining what needs to be corrected.",
          ]}
        />
        <P>
          On approval, the profile becomes the client's live data, and the
          account activation card appears so the client portal account can be
          created.
        </P>

        <Heading>Reviewing a Profile Update</Heading>
        <Steps
          items={[
            "Click a profile with \"Profile Update\" type to open the diff review page.",
            "The page shows a side-by-side comparison of current vs. proposed changes for each section that was modified.",
            "Click Approve to apply the changes to the live profile, or Reject with a comment.",
          ]}
        />

        <Tip>
          Approving a profile update does not change the client's status — the
          client stays in their current status. Profile reviews and status
          changes are independent.
        </Tip>
      </>
    ),
  },

  // ─── Task Overview ───
  {
    id: "tasks",
    title: "Task Overview",
    subtitle: "View and manage all tasks across the system",
    icon: ClipboardList,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    content: (
      <>
        <P>
          The Task Overview page shows every tax record task in the system. You
          can filter by status, client, assigned accountant, or search by task
          name.
        </P>
        <Heading>Table Columns</Heading>
        <BulletList
          items={[
            "Task — the task name, with category and sub-category shown beneath.",
            "Client — which client the task belongs to.",
            "Assigned To — the accountant(s) working on this task.",
            "Period — the tax year and period (e.g., 2025 / Q1).",
            "Status — current workflow status.",
            "Deadline — when the task is due. Overdue tasks have a red border.",
            "Created — who created it and when.",
          ]}
        />

        <Heading>Creating a Single Task</Heading>
        <Steps
          items={[
            "Click New Task to open the creation form.",
            "Select a client and the assigned accountant.",
            "Pick the category, sub-category, and task name using the cascading dropdowns. You can create new entries inline with \u201c+ Add New\u201d.",
            "Set the year, period, and deadline.",
            "Optionally add a description, then click Create Task.",
          ]}
        />
        <Tip>
          You can delete unused categories, sub-categories, or task names from
          the dropdown menu by hovering over an option and clicking the trash
          icon. Items that are already used by existing tasks cannot be deleted.
        </Tip>

        <Heading>Bulk Import</Heading>
        <Steps
          items={[
            "Click Import to open the bulk import form.",
            "Download the Excel template to see the required format.",
            "Fill in the template with task details — client names, categories, deadlines, and assigned accountants.",
            "Upload the completed file to preview the import.",
            "Review the preview table for any validation errors, then submit.",
          ]}
        />

        <Heading>Reviewing Tasks</Heading>
        <P>
          As a Manager, you can review tasks that are in "Submitted" status.
          Click a task to open the details page where you can:
        </P>
        <BulletList
          items={[
            "Review the accountant's working files and output file / tax return.",
            "Approve the task — moves it to \"Approved for Filing\".",
            "Reject the task — sends it back to the accountant with your feedback.",
          ]}
        />

        <Heading>Task Workflow</Heading>
        <StatusTable
          rows={[
            {
              status: "Open",
              color: "bg-blue-50 text-blue-700",
              description:
                "Assigned to an accountant. They're working on it.",
            },
            {
              status: "Submitted",
              color: "bg-amber-50 text-amber-700",
              description:
                "The accountant submitted for review. You can approve or reject.",
            },
            {
              status: "Rejected",
              color: "bg-red-50 text-red-700",
              description:
                "Sent back for revision. The accountant will correct and resubmit.",
            },
            {
              status: "Approved for Filing",
              color: "bg-emerald-50 text-emerald-700",
              description:
                "Approved. The accountant will file with BIR externally.",
            },
            {
              status: "Filed",
              color: "bg-purple-50 text-purple-700",
              description:
                "Filed with BIR. The accountant uploads proof of filing.",
            },
            {
              status: "Completed",
              color: "bg-emerald-50 text-emerald-700",
              description:
                "Finalized. Files merged into the client's permanent tax records.",
            },
          ]}
        />
      </>
    ),
  },

  // ─── Client Onboarding Workflow ───
  {
    id: "client-onboarding",
    title: "Client Onboarding Workflow",
    subtitle: "The end-to-end process for onboarding a new client",
    icon: FileText,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    content: (
      <>
        <P>
          The onboarding workflow is a multi-step process that involves several
          roles. Here's how it works from start to finish:
        </P>
        <Steps
          items={[
            "An OOS user creates a new client (the client starts in Onboarding status).",
            "The OOS fills in the client's full profile across 7 sections (business details, registration info, officers, credentials, etc.).",
            "The OOS submits the profile for review.",
            "A QTD reviewer (or you, as Manager) reviews the profile and either approves or rejects it with feedback.",
            "If rejected, the OOS makes corrections and resubmits. This cycle repeats until approved.",
            "On approval, the profile becomes the client's live data.",
            "The OOS creates the client's portal account (sends an activation email).",
            "The OOS performs handoff — assigns CSD and OOS accountants and creates a frozen archive snapshot.",
            "You set the client's status to Active Client when ready.",
          ]}
        />

        <Heading>After Handoff</Heading>
        <P>
          Once handed off, the assigned accountants can view the client's
          details and work on their tax record tasks. The OOS who onboarded the
          client sees a frozen snapshot of the profile as it was at handoff
          time (unless they're also assigned as an accountant).
        </P>

        <Heading>Your Role</Heading>
        <BulletList
          items={[
            "Review and approve/reject onboarding profiles (from the Client Profiles page).",
            "Change the client's status at any stage (from the client details page).",
            "Oversee the process — you have visibility into all clients and their onboarding status on the Dashboard.",
          ]}
        />
      </>
    ),
  },

  // ─── Client Status Management ───
  {
    id: "client-status",
    title: "Client Status Management",
    subtitle: "How and when to change client statuses",
    icon: Settings,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    content: (
      <>
        <P>
          You are the only role that can change a client's status. This is done
          from the client details page using the "Change Status" button in the
          header.
        </P>
        <Heading>Recommended Usage</Heading>
        <BulletList
          items={[
            "Onboarding — keep this status while the OOS is building the client's profile and the handoff process is ongoing.",
            "Active Client — set this after the handoff is complete, accountants are assigned, and the client is being actively serviced.",
            "Offboarding — initiates the offboarding workflow. You'll be asked to assign an OOS accountant, set an end-of-engagement date, and optionally set a deactivation date.",
            "Inactive Client — set when the client is fully off-boarded and no ongoing work remains.",
          ]}
        />

        <Heading>Initiating Offboarding</Heading>
        <P>
          When you select "Offboarding" as the new status, the modal expands
          with additional fields:
        </P>
        <BulletList
          items={[
            "Assigned OOS Accountant — the accountant responsible for the offboarding process.",
            "End of Engagement Date — when the professional engagement formally ends.",
            "Deactivation Date (optional) — if set, a daily job at midnight (Asia/Manila timezone) deactivates all client portal accounts and sets the client status to Inactive on this date.",
          ]}
        />

        <Heading>After Initiating Offboarding</Heading>
        <P>
          The client details page will show an offboarding banner with the
          assigned OOS, dates, and actions. From there you can:
        </P>
        <BulletList
          items={[
            "Send the end-of-engagement letter email using a template.",
            "Toggle tax records protection — blocks client portal users from downloading any files (not just tax records) while still allowing them to browse. Internal employee users are unaffected.",
            "Deactivate individual client portal accounts from the Client Accounts card.",
          ]}
        />

        <Tip>
          All status transitions except Offboarding are simple changes. Only
          Offboarding requires the additional assignment and date setup.
        </Tip>
      </>
    ),
  },

  // ─── Consultation Logs ───
  {
    id: "consultation-logs",
    title: "Consultation Logs",
    subtitle: "Log and track client consultations",
    icon: MessageSquareText,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    content: (
      <>
        <P>
          The Consultation Logs page lets you log consultations rendered to
          clients. Each log tracks the date, time, platform, subject, and
          duration of a consultation session.
        </P>

        <Heading>Creating a Consultation Log</Heading>
        <Steps
          items={[
            "Click New Consultation to open the form.",
            "Select the client, date, platform, start and end times.",
            "Enter the subject and optionally add notes and attachments.",
            "Check \"Mark as courtesy\" if the consultation shouldn't count toward billing.",
            "Click Save as Draft — the log is saved but not yet submitted.",
          ]}
        />

        <Heading>Submitting for Review</Heading>
        <P>
          Open a draft log and click Submit for Review. A QTD reviewer or
          Manager will approve or reject it. You can add a comment when
          submitting.
        </P>

        <Heading>Editing & Resubmitting</Heading>
        <P>
          If a log is rejected, you'll see a red banner with an "Edit &
          Resubmit" button. Make corrections and submit again.
        </P>

        <Heading>Billable Types</Heading>
        <BulletList
          items={[
            "Included — within the client's monthly included hours.",
            "Billable — beyond the monthly included hours, billed at the hourly rate.",
            "Courtesy — manually flagged, doesn't count toward billing.",
          ]}
        />
        <P>
          When a log is approved, the system recomputes all approved logs for
          that client and month in chronological order. Once cumulative hours
          exceed the client's included-hours cap, remaining logs become Billable.
          If no consultation config exists for the client, all non-courtesy logs
          default to Billable.
        </P>

        <Heading>Client Details — Consultations Tab</Heading>
        <P>
          On any client's details page, the Consultations tab shows a monthly
          summary with a progress bar, hours breakdown (included, billable,
          courtesy), and estimated billable fees. Below that is a table of
          approved logs for the selected month.
        </P>
      </>
    ),
  },

  // ─── Notifications ───
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Stay informed about system activity",
    icon: Bell,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    content: (
      <>
        <P>
          You receive notifications for key events across the system. The bell
          icon in the top bar shows a dot when you have unread notifications,
          and the sidebar shows the count.
        </P>
        <Heading>Notification Types</Heading>
        <BulletList
          items={[
            "Task Submitted — an accountant submitted a task for review.",
            "Task Approved — a task was approved (by you or a QTD reviewer).",
            "Task Rejected — a task was rejected.",
            "Task Filed — an accountant marked a task as filed.",
            "Task Completed — a task was completed.",
            "Client Handoff — a client was handed off by OOS.",
            "Profile Submitted — a client profile was submitted for review.",
            "Offboarding Assigned — an OOS accountant was assigned to offboard a client.",
          ]}
        />
        <P>
          Click any notification to navigate directly to the relevant task or
          client page.
        </P>
      </>
    ),
  },

  // ─── File Uploads ───
  {
    id: "file-uploads",
    title: "File Upload Guidelines",
    subtitle: "Accepted file types and size limits",
    icon: Upload,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    content: (
      <>
        <P>
          All file uploads across the system are validated before uploading.
          Files that don't meet the requirements will be skipped with an error
          message.
        </P>
        <Heading>Document Uploads</Heading>
        <BulletList
          items={[
            "Accepted formats: PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, JPEG, PNG, GIF, WEBP, DAT",
            "Maximum file size: 25MB per file",
            "Applies to: task files, invoice attachments, payment receipts, consultation attachments, and client profile files",
          ]}
        />
        <Heading>Image Uploads (Rich Text Editor)</Heading>
        <BulletList
          items={[
            "Accepted formats: JPG, JPEG, PNG, GIF, WEBP",
            "Maximum file size: 10MB per file",
            "Applies to: images embedded in comments and consultation notes",
          ]}
        />
      </>
    ),
  },

  // ─── Profile ───
  {
    id: "profile",
    title: "Your Profile",
    subtitle: "Manage your personal information and password",
    icon: UserCircle,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    content: (
      <>
        <P>
          Access your profile from the user menu in the top-right corner by
          clicking View Profile.
        </P>
        <Heading>Personal Information</Heading>
        <BulletList
          items={[
            "Update your first name, last name, and email address.",
            "Manage your professional titles (prefix and suffix).",
            "Upload or remove your profile photo — hover over your avatar to see the option.",
          ]}
        />
        <Heading>Change Password</Heading>
        <P>
          Enter your current password and your new password to update it. You
          will need to confirm the new password before saving.
        </P>
      </>
    ),
  },
];
