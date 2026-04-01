import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart2,
  Bell,
  UserCircle,
  FileText,
  FolderEdit,
  MessageSquareText,
  Upload,
} from "lucide-react";
import { P, Heading, Steps, BulletList, StatusTable, Tip } from "./shared";
import type { HelpSection } from "../types";

export const csdSections: HelpSection[] = [
  // ─── Dashboard ───
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "Your daily overview at a glance",
    icon: LayoutDashboard,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    content: (
      <>
        <P>
          The dashboard is your home screen. It gives you a quick snapshot of
          your current workload and highlights items that need your attention.
        </P>
        <Heading>Task Stats</Heading>
        <P>
          The top row shows four key numbers: how many tasks are open and
          waiting for you, how many are newly assigned today, how many you've
          submitted for review, and how many are approved and ready for filing.
        </P>
        <Heading>Needs Attention</Heading>
        <P>
          Below the stats, you'll find two collapsible, paginated tables
          showing tasks that need immediate action:
        </P>
        <BulletList
          items={[
            "Overdue Tasks — tasks past their deadline that haven't been submitted yet.",
            "Rejected Tasks — tasks that were reviewed and sent back for revision. Open these to see the reviewer's comments and make the requested changes.",
          ]}
        />
        <Heading>To-Do List</Heading>
        <P>
          A personal checklist you can use to track your own notes and
          reminders. Only you can see your to-do items.
        </P>
      </>
    ),
  },

  // ─── Task List ───
  {
    id: "tasks",
    title: "Task List",
    subtitle: "View and manage all your assigned tasks",
    icon: ClipboardList,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    content: (
      <>
        <P>
          The Task List page shows every tax record task assigned to you. You
          can filter by status, search by task name, or sort by deadline to
          find what you need.
        </P>
        <Heading>Understanding the Table</Heading>
        <BulletList
          items={[
            "Task — the task name, with the category and sub-category shown beneath it.",
            "Client — the client this task belongs to.",
            "Period — the tax year and period (e.g., 2025 / Q1).",
            "Status — where the task is in the workflow.",
            "Deadline — when the task is due. Overdue tasks are highlighted with a red border.",
            "Created — who created the task and when.",
          ]}
        />
        <Tip>
          Click any row to open the full task details where you can upload
          files and take action.
        </Tip>
      </>
    ),
  },

  // ─── Task Workflow ───
  {
    id: "task-workflow",
    title: "Task Workflow",
    subtitle: "How a task moves from start to finish",
    icon: FileText,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    content: (
      <>
        <P>
          Each task follows a defined workflow. Your role is to work on the
          task, upload the required files, and move it through to completion.
        </P>
        <StatusTable
          rows={[
            {
              status: "Open",
              color: "bg-blue-50 text-blue-700",
              description:
                "The task is assigned to you. Upload your working files and the output file / tax return, then submit for review.",
            },
            {
              status: "Submitted",
              color: "bg-amber-50 text-amber-700",
              description:
                "Waiting for a reviewer to check your work. You can recall your submission if you need to make changes.",
            },
            {
              status: "Rejected",
              color: "bg-red-50 text-red-700",
              description:
                "The reviewer sent it back with feedback. Check the activity log for their comments, make corrections, and resubmit.",
            },
            {
              status: "Approved for Filing",
              color: "bg-emerald-50 text-emerald-700",
              description:
                "Your work has been approved. File the documents with the BIR externally, then come back and mark it as filed.",
            },
            {
              status: "Filed",
              color: "bg-purple-50 text-purple-700",
              description:
                "Upload the proof of filing document, then mark the task as completed.",
            },
            {
              status: "Completed",
              color: "bg-emerald-50 text-emerald-700",
              description:
                "All done. Your working files, output file, and proof of filing are merged into the client's permanent tax records. No further action needed.",
            },
          ]}
        />
        <Heading>Working on a Task</Heading>
        <Steps
          items={[
            "Open the task from your Task List.",
            "Upload your working files (spreadsheets, supporting documents, etc.).",
            "Upload the output file / tax return — this is the main deliverable.",
            "Click Submit for Review to send it to a reviewer.",
          ]}
        />
        <Heading>After Approval</Heading>
        <Steps
          items={[
            "File the documents with the BIR through the external filing system.",
            "Return to the task and click Mark as Filed.",
            "Upload the proof of filing (the confirmation document from BIR).",
            "Click Mark as Completed to finalize the task.",
          ]}
        />
        <Heading>Recalling a Submission</Heading>
        <P>
          If you submitted a task but realize you need to make changes, you can
          click Recall Submission while it's still in "Submitted" status. This
          moves it back to "Open" so you can edit your files and resubmit.
        </P>
        <Tip>
          Check the Activity Log on the right side of the task details page to
          see the full history of actions and reviewer comments.
        </Tip>
      </>
    ),
  },

  // ─── Client List ───
  {
    id: "clients",
    title: "Client List",
    subtitle: "Your assigned clients and their details",
    icon: Users,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    content: (
      <>
        <P>
          The Client List shows all clients assigned to you. You can see each
          client's status, how many tasks are pending or overdue, and their
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

  // ─── Editing Client Profiles ───
  {
    id: "edit-profile",
    title: "Editing Client Profiles",
    subtitle: "How to update an active client's information",
    icon: FolderEdit,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    content: (
      <>
        <P>
          When a client's information needs to be updated (e.g., new address,
          changed officers, updated credentials), you can submit a profile
          update for review.
        </P>
        <Steps
          items={[
            "Go to the client's details page and click Edit Profile.",
            "Make your changes across any of the profile sections.",
            "Add a comment explaining what changed and why (optional but recommended).",
            "Click Submit Update to send it for review.",
          ]}
        />
        <Heading>After Submitting</Heading>
        <P>
          A reviewer will compare your changes against the current profile. If
          approved, the changes go live immediately. If rejected, you'll get a
          notification with feedback — make the corrections and resubmit.
        </P>
        <Tip>
          You can only have one pending profile update per client at a time.
          Wait for the current one to be reviewed before submitting another.
        </Tip>
      </>
    ),
  },

  // ─── Analytics ───
  {
    id: "analytics",
    title: "My Analytics",
    subtitle: "Track your performance and productivity",
    icon: BarChart2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    content: (
      <>
        <P>
          The analytics page gives you a detailed view of your personal
          performance metrics across eight stat cards, several charts, and a
          client portfolio table.
        </P>

        <Heading>Task Pipeline</Heading>
        <P>
          A snapshot of all tasks assigned to you, grouped by status. Shows
          where everything stands right now across the full lifecycle: Open,
          Submitted, Rejected, Approved for Filing, Filed, and Completed.
        </P>

        <Heading>Deadlines</Heading>
        <P>
          How many tasks need your attention based on urgency. Only counts
          tasks in Open or Rejected status — these are the statuses where the
          ball is with you. Submitted tasks are with the reviewer, so they're
          excluded.
        </P>
        <BulletList
          items={[
            "Overdue — the deadline has already passed.",
            "Due Today — the deadline falls within today.",
            "Due This Week — the deadline falls within the next 7 days (includes today).",
          ]}
        />

        <Heading>Productivity</Heading>
        <P>What you've accomplished this month.</P>
        <BulletList
          items={[
            "Completed This Month — distinct tasks completed since the 1st of the month.",
            "Submitted This Month — distinct tasks submitted for review. Resubmissions of the same task don't inflate this number.",
            "New Tasks This Month — tasks assigned to you that were created since the 1st.",
          ]}
        />

        <Heading>Efficiency</Heading>
        <P>How fast you close out work.</P>
        <BulletList
          items={[
            "On-Time Rate — percentage of completed tasks where the completion happened on or before the deadline.",
            "Avg Completion Days — average calendar days from task creation to completion (includes weekends and holidays). Same-day completions show as fractional values.",
          ]}
        />

        <Heading>Quality</Heading>
        <P>How clean your work is when submitted for review.</P>
        <BulletList
          items={[
            "First-Attempt Approval Rate — percentage of approved tasks that had zero rejections (approved on the first try).",
            "Avg Rejection Cycles — for tasks that were rejected at least once, the average number of times they were rejected before approval. Tasks approved on the first attempt are excluded. A value of 1.0 means rejections are resolved in one revision; 3.0+ suggests repeated back-and-forth.",
          ]}
        />

        <Heading>Responsiveness</Heading>
        <P>How quickly you act on assigned work.</P>
        <BulletList
          items={[
            "Avg Days to First Submit — average days between task creation and your first submission. Only counts tasks you've submitted at least once — tasks never submitted are excluded.",
            "Avg Rejection Turnaround — average days between a reviewer's rejection and your next resubmission. Measures how quickly you address feedback. Recalled-then-resubmitted gaps are excluded since those are voluntary pull-backs, not rejections.",
          ]}
        />

        <Heading>Workload</Heading>
        <P>Your current capacity at a glance.</P>
        <BulletList
          items={[
            "Active Task Count — total non-completed tasks assigned to you (open + submitted + rejected + approved for filing + filed).",
            "Assigned Client Count — distinct clients that have at least one active task assigned to you.",
          ]}
        />

        <Heading>Monthly Trend</Heading>
        <P>
          Month-over-month direction. Compares your completed tasks this month
          against last month and shows the percentage change. Shows "N/A" if
          last month had zero completions. Positive means you're improving,
          negative means you're slipping.
        </P>

        <Heading>Charts</Heading>
        <BulletList
          items={[
            "Tasks by Category — see how your work is distributed across tax categories, split by active vs. completed.",
            "Monthly Throughput — track your completed tasks over time with an adjustable range (3, 6, or 12 months).",
            "On-Time Rate — visual donut chart showing on-time vs. late completions.",
            "Quality Metrics — your total submissions, first-attempt approvals, approval rate, and average rejection cycles.",
          ]}
        />

        <Heading>Client Portfolio</Heading>
        <P>
          A table at the bottom shows all your assigned clients with their
          status, total task count, pending and overdue numbers, and nearest
          deadline. Click a client name to jump to their details page.
        </P>
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
            "Excess — beyond the monthly cap, billed at the excess rate.",
            "Courtesy — manually flagged, doesn't count toward billing.",
          ]}
        />
        <P>
          When a log is approved, the system recomputes all approved logs for
          that client and month in chronological order. Once cumulative hours
          exceed the client's included-hours cap, remaining logs become Excess.
          If no consultation config exists for the client, all non-courtesy
          logs default to Excess.
        </P>

        <Heading>Client Details — Consultations Tab</Heading>
        <P>
          On any client's details page, the Consultations tab shows a monthly
          summary with a progress bar, hours breakdown (included, excess,
          courtesy), and estimated excess fees. Below that is a table of
          approved logs for the selected month.
        </P>
      </>
    ),
  },

  // ─── Notifications ───
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Stay on top of updates and assignments",
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
            "Task Assigned — a new task has been assigned to you.",
            "Task Approved — your submission was approved by a reviewer.",
            "Task Rejected — your submission was rejected. Check the comments for feedback.",
            "Task Completed — a task you worked on has been marked as completed.",
            "Client Handoff — a client has been handed off and assigned to you.",
          ]}
        />
        <P>
          Click any notification to go directly to the relevant task or client
          page.
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
