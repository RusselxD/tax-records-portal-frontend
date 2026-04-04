import {
  LayoutDashboard,
  Users,
  UserCheck,
  ListTodo,
  Bell,
  UserCircle,
  FileText,
  FileSearch,
  GitCompare,
  MessageSquareText,
} from "lucide-react";
import { P, Heading, Steps, BulletList, StatusTable, Tip } from "./shared";
import type { HelpSection } from "../types";

export const qtdSections: HelpSection[] = [
  // ─── Dashboard ───
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "Your review workload at a glance",
    icon: LayoutDashboard,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    content: (
      <>
        <P>
          The QTD dashboard is focused on your review activity. It shows three
          key stats at the top and two tables below for managing your review
          queue.
        </P>
        <Heading>Reviewer Stats</Heading>
        <BulletList
          items={[
            "Awaiting Review — how many tasks are currently waiting for your review. If new tasks arrived today, a pill shows the count.",
            "Approved Today — how many tasks you've approved today.",
            "Approval Rate — your approval rate for the current month. Counts individual review decisions — if you reject and then approve the same task, that's 1 approval and 1 rejection (50%). Shows \"—\" if you haven't reviewed anything this month yet.",
          ]}
        />
        <Heading>Review Queue</Heading>
        <P>
          The first table shows submitted tasks from clients assigned to you
          that are waiting for your review — not all submitted tasks in the
          system. Click any row to open the task details and take action
          (approve or reject).
        </P>
        <Heading>Recently Decided</Heading>
        <P>
          The second table shows tasks you've recently approved or rejected,
          so you can track your review history. Click any row to revisit the
          task details.
        </P>
      </>
    ),
  },

  // ─── Client List ───
  {
    id: "clients",
    title: "Client List",
    subtitle: "View clients and their details",
    icon: Users,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    content: (
      <>
        <P>
          The Client List shows clients you have visibility into. You can see
          each client's status, task counts (total, pending, overdue), and
          nearest deadline.
        </P>
        <Heading>Client Details</Heading>
        <P>
          Click a client to view their full profile — business information,
          registration details, contact persons, and more. The profile is
          organized into expandable sections that load on demand.
        </P>
        <P>
          On the right side, you'll find a summary card with the client's key
          info and a list of their tax record tasks.
        </P>
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
          The Client Profiles page shows all profile submissions that need
          your review or that you've already reviewed. There are two types:
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
            "Review all 7 sections of the client's information carefully.",
            "Click Approve to accept the profile, or Reject with a comment explaining what needs to be corrected.",
          ]}
        />
        <P>
          On approval, the profile becomes the client's live data. The OOS
          user can then activate the client's portal account and proceed with
          handoff.
        </P>

        <Heading>Reviewing a Profile Update</Heading>
        <Steps
          items={[
            "Click a profile with \"Profile Update\" type to open the diff review page.",
            "The page shows a comparison of current vs. proposed changes for each section that was modified.",
            "Click Approve to apply the changes to the live profile, or Reject with a comment.",
          ]}
        />

        <Tip>
          Approving a profile (onboarding or update) does not change the
          client's status. Profile reviews and client status changes are
          independent — only the Manager can change client statuses.
        </Tip>
      </>
    ),
  },

  // ─── Reviewing Onboarding Profiles ───
  {
    id: "review-onboarding",
    title: "Reviewing Onboarding Profiles",
    subtitle: "What to look for when reviewing a new client's profile",
    icon: FileSearch,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    content: (
      <>
        <P>
          When an OOS user submits a new client's profile for review, you need
          to verify that all information is complete and accurate across 7
          sections. Here's what each section contains:
        </P>

        <Heading>1. Main Details</Heading>
        <P>
          MRE code, commencement of work date, and assigned accountants
          (CSD/OOS and QTD).
        </P>

        <Heading>2. Client Information</Heading>
        <P>
          The most detailed section — general information (registered name,
          trade name, branches, organization type) plus 9 sub-sections:
        </P>
        <BulletList
          items={[
            "BIR Branch Details — per-branch details with file uploads (Certificate of Registration, forms, receipts, etc.).",
            "BIR Tax Compliance — gross sales, withholding agents, income tax regime.",
            "BIR Compliance Breakdown — 29-item checklist across 8 categories.",
            "DTI Details — registration and BMBE compliance.",
            "SEC Details — incorporation info and file uploads.",
            "SSS, PhilHealth, HDMF — government agency registration details.",
            "City Hall Details — per-city permits and file uploads.",
          ]}
        />

        <Heading>3. Owner's or Corporate Officer's Information</Heading>
        <P>
          List of officers with personal details, plus the designated point of
          contact for the firm.
        </P>

        <Heading>4. Access & Credentials</Heading>
        <P>Platform login credentials for accessing client systems.</P>

        <Heading>5. Scope of Engagement</Heading>
        <P>
          Service agreement details: document gathering requirements, client
          engagements (tax, bookkeeping, government agencies, payments,
          consultation), and required deliverables.
        </P>

        <Heading>6. Professional Fees</Heading>
        <P>Fee schedule with line items and amounts.</P>

        <Heading>7. Onboarding Info, Documents & Notes</Heading>
        <P>
          Internal coordination: group chat details, meeting records, and
          pending action items.
        </P>

        <Tip>
          If you reject, provide specific and actionable feedback in your
          comment so the OOS user knows exactly what to fix. Vague rejections
          lead to back-and-forth cycles.
        </Tip>
      </>
    ),
  },

  // ─── Reviewing Profile Updates ───
  {
    id: "review-updates",
    title: "Reviewing Profile Updates",
    subtitle: "How the diff view works for profile change requests",
    icon: GitCompare,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    content: (
      <>
        <P>
          When an accountant submits a profile update for an active client,
          the review page shows a diff view — a section-by-section comparison
          of the current live profile against the proposed changes.
        </P>
        <Heading>How the Diff View Works</Heading>
        <BulletList
          items={[
            "Only sections with changes are shown — unchanged sections are hidden.",
            "For each changed section, you can see what the current value is and what the proposed new value would be.",
            "The accountant may have included a comment explaining why the changes were made.",
          ]}
        />
        <Heading>Taking Action</Heading>
        <BulletList
          items={[
            "Approve — the proposed changes overwrite the live profile immediately.",
            "Reject — the changes are discarded and the accountant is notified with your feedback. They can make corrections and resubmit.",
          ]}
        />
        <Tip>
          Only one profile update per client can be pending at a time. The
          accountant must wait for your decision before submitting another
          update.
        </Tip>
      </>
    ),
  },

  // ─── Task Management ───
  {
    id: "tasks",
    title: "Task Management",
    subtitle: "Create, assign, and oversee tax record tasks",
    icon: ListTodo,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    content: (
      <>
        <P>
          The Task Management page shows all tax record tasks in the system.
          You can filter by status, client, or search by task name.
        </P>

        <Heading>Creating Tasks</Heading>
        <P>
          You can create tasks individually or import them in bulk using an
          Excel template.
        </P>
        <Steps
          items={[
            "Click Import to open the bulk import form.",
            "Download the Excel template to see the required format.",
            "Fill in the template with task details — client names, categories, deadlines, and assigned accountants.",
            "Upload the completed file to preview and validate the import.",
            "Review the preview for any errors, then submit.",
          ]}
        />

        <Heading>Reviewing Tasks</Heading>
        <P>
          When an accountant submits a task for review, it appears in your
          dashboard queue and in the task list with "Submitted" status. Click
          the task to open the details page where you can:
        </P>
        <BulletList
          items={[
            "Review the accountant's working files and output file / tax return.",
            "Read any comments from the accountant.",
            "Approve — moves the task to \"Approved for Filing\" so the accountant can proceed with BIR filing.",
            "Reject — sends the task back to the accountant with your feedback for revision.",
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
                "Ready for your review. You can approve or reject.",
            },
            {
              status: "Rejected",
              color: "bg-red-50 text-red-700",
              description:
                "Sent back for revision with your feedback.",
            },
            {
              status: "Approved for Filing",
              color: "bg-emerald-50 text-emerald-700",
              description:
                "You approved it. The accountant will file with BIR.",
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
                "Finalized. Files merged into permanent tax records.",
            },
          ]}
        />
        <Tip>
          Your primary action point is at the "Submitted" status — that's when
          the accountant is waiting for your review. All other status
          transitions are handled by the accountant.
        </Tip>
      </>
    ),
  },

  // ─── Task Details ───
  {
    id: "task-details",
    title: "Reviewing a Task",
    subtitle: "What you see on the task details page",
    icon: FileText,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    content: (
      <>
        <P>
          When you open a task, the details page shows all the information
          you need to make a review decision.
        </P>
        <Heading>What's on the Page</Heading>
        <BulletList
          items={[
            "Task header — task name, category, sub-category, status badge, and deadline.",
            "Status banner — contextual message based on the current status (e.g., \"This task is awaiting your review\").",
            "Task info panel — client, assigned accountants, period, description, and creation details.",
            "Working files — all files the accountant uploaded as part of their work.",
            "Output file — the main deliverable document.",
            "Activity log — full history of actions (submissions, approvals, rejections) with timestamps and comments.",
            "Client summary card — quick reference to the client's key info.",
          ]}
        />
        <Heading>Taking Action</Heading>
        <P>
          When the task is in "Submitted" status, you'll see Approve and
          Reject buttons. On rejection, you must provide a comment explaining
          what needs to be corrected. On approval, an optional comment can be
          added.
        </P>
        <Tip>
          Check the Activity Log to see if this task has been previously
          rejected — it may be a resubmission, and you can see what feedback
          was given last time.
        </Tip>
      </>
    ),
  },

  // ─── Consultation Logs ───
  {
    id: "consultation-logs",
    title: "Consultation Logs",
    subtitle: "Review consultation logs submitted by accountants",
    icon: MessageSquareText,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    content: (
      <>
        <P>
          The Consultation Logs page shows logs submitted by OOS and CSD
          accountants for review. You can approve or reject submitted logs.
        </P>

        <Heading>Reviewing a Log</Heading>
        <Steps
          items={[
            "Click a submitted log to open the detail page.",
            "Review the consultation details, notes, and attachments.",
            "Click Approve to accept, or Reject with feedback.",
            "You can add a comment with your decision.",
          ]}
        />

        <Heading>Billable Types</Heading>
        <BulletList
          items={[
            "Included — within the client's monthly included hours.",
            "Billable — beyond the monthly included hours, billed at the hourly rate.",
            "Courtesy — manually flagged by the accountant, not billed.",
          ]}
        />
        <P>
          When a log is approved, the system recomputes all approved logs for
          that client and month in chronological order. Once cumulative hours
          exceed the client's included-hours cap, remaining logs become Billable.
        </P>
      </>
    ),
  },

  // ─── Notifications ───
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Stay on top of review requests and updates",
    icon: Bell,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    content: (
      <>
        <P>
          You'll receive notifications when something requires your attention.
          The notification bell in the top bar shows a dot when you have unread
          items, and the sidebar shows the count.
        </P>
        <Heading>Notification Types</Heading>
        <BulletList
          items={[
            "Task Submitted — an accountant submitted a task for your review.",
            "Task Filed — an accountant marked a task you approved as filed.",
            "Task Completed — a task you reviewed has been completed.",
            "Profile Submitted — a client profile was submitted for your review (onboarding or update).",
          ]}
        />
        <P>
          Click any notification to go directly to the relevant task or client
          page.
        </P>
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
