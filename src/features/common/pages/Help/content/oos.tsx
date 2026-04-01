import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart2,
  Bell,
  UserCircle,
  FileText,
  FolderEdit,
  UserPlus,
  UserMinus,
  FilePlus,
  Send,
  Archive,
  ArrowRightLeft,
  MessageSquareText,
  Upload,
} from "lucide-react";
import { P, Heading, Steps, BulletList, StatusTable, Tip } from "./shared";
import type { HelpSection } from "../types";

export const oosSections: HelpSection[] = [
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
          Below the stats, you'll find two tables showing tasks that need
          immediate action:
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

  // ─── Client Onboarding ───
  {
    id: "client-onboarding",
    title: "Client Onboarding",
    subtitle: "View and manage clients you're onboarding",
    icon: UserPlus,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    content: (
      <>
        <P>
          The Client Onboarding page shows all clients you've created that are
          still in the onboarding process. You can see each client's current
          status, whether their profile has been submitted or is still in
          draft, and any review outcomes.
        </P>
        <Heading>Client Statuses in Onboarding</Heading>
        <BulletList
          items={[
            "Draft — you've created the client but haven't submitted their profile for review yet.",
            "Submitted — the profile has been sent to a QTD reviewer and is awaiting review.",
            "Rejected — the reviewer sent the profile back with feedback. You need to make corrections and resubmit.",
            "Approved — the profile has been approved. You can now activate the client's portal account and proceed with handoff.",
          ]}
        />
        <Tip>
          Click any client in the list to open their profile preview page where
          you can review the submitted information, see reviewer comments, or
          take the next step in the onboarding process.
        </Tip>
      </>
    ),
  },

  // ─── Creating a New Client ───
  {
    id: "new-client",
    title: "Creating a New Client",
    subtitle: "How to build a complete client profile",
    icon: FilePlus,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    content: (
      <>
        <P>
          To onboard a new client, you create their profile by filling in
          seven sections of detailed information. This is the most
          comprehensive form in the system — take your time to fill it
          accurately, as the QTD reviewer will check everything before
          approval.
        </P>
        <Heading>The 7 Sections</Heading>

        <Heading>1. Main Details</Heading>
        <P>
          Basic engagement information: MRE code, commencement of work date,
          and accountant assignments (CSD/OOS accountants and QTD accountant).
        </P>

        <Heading>2. Client Information</Heading>
        <P>
          The largest section — covers all regulatory and compliance details.
          Starts with general information (registered name, trade name, number
          of branches, organization type), then 9 sub-sections:
        </P>
        <BulletList
          items={[
            "BIR Branch Details — details per branch including TIN, RDO, address, and 9 file uploads each (Certificate of Registration, Form 1901, ATP, etc.).",
            "BIR Tax Compliance — gross sales list, top withholding agents, income tax regime.",
            "BIR Compliance Breakdown — 29 pre-seeded checklist items across 8 categories, plus a free-text field for additional items.",
            "DTI Details — business registration, BMBE compliance, and related file uploads.",
            "SEC Details — incorporation information and 10 file uploads.",
            "SSS Details — government agency registration (employer number, portal credentials, file uploads).",
            "PhilHealth Details — same format as SSS.",
            "HDMF / Pag-IBIG Details — same format as SSS.",
            "City Hall Details — details per city including permits, expiration dates, and 11 file uploads each.",
          ]}
        />

        <Heading>3. Owner's or Corporate Officer's Information</Heading>
        <P>
          A list of corporate officers (name, birthday, address, position, ID
          scan with signature) and point of contact details (name, email,
          phone, role in the organization).
        </P>

        <Heading>4. Access & Credentials</Heading>
        <P>
          Platform login credentials the firm needs to access systems on behalf
          of the client. Each entry has a platform name, URL, username/email,
          and password.
        </P>

        <Heading>5. Scope of Engagement</Heading>
        <P>Three sub-sections covering the service agreement:</P>
        <BulletList
          items={[
            "Documents & Info Gathering — 6 rich text fields for different document categories.",
            "Client Engagements — tax compliance, bookkeeping, SSS/PhilHealth/HDMF, payment processing, and consultation hours with billing calculations.",
            "Required Deliverables & Reports — what the firm will deliver to the client.",
          ]}
        />

        <Heading>6. Professional Fees</Heading>
        <P>
          A fee schedule with pre-seeded line items. You can edit amounts, add
          custom fee entries, or remove items as needed.
        </P>

        <Heading>7. Onboarding Info, Documents & Notes</Heading>
        <P>
          Internal coordination details: group chat information (name,
          platform, who created it) and pending action items to track.
        </P>
        <Heading>Working with the Form</Heading>
        <BulletList
          items={[
            "Each section is collapsible — expand only the one you're working on.",
            "Your progress is saved as you go. You can leave and come back to continue later.",
            "Some fields support rich text formatting (bold, italic, lists, links, images).",
            "File uploads are required in several sections — make sure you have the documents ready.",
          ]}
        />
        <Tip>
          You don't need to fill everything in one sitting. Save your progress
          and come back when you have all the required documents and
          information.
        </Tip>
      </>
    ),
  },

  // ─── Submitting for Review ───
  {
    id: "submit-review",
    title: "Submitting for Review",
    subtitle: "Sending the client profile to QTD for approval",
    icon: Send,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    content: (
      <>
        <P>
          Once the client profile is complete, you submit it for review by a
          QTD reviewer. The reviewer will go through all 7 sections and either
          approve or reject the profile.
        </P>
        <Heading>How to Submit</Heading>
        <Steps
          items={[
            "Make sure all required sections are filled in.",
            "Click Submit for Review from the client profile page.",
            "The profile status changes to Submitted and the assigned QTD reviewer is notified.",
          ]}
        />
        <Heading>If Rejected</Heading>
        <P>
          If the reviewer rejects the profile, you'll receive a notification
          with their feedback. The status banner on the profile page will show
          the rejection reason.
        </P>
        <Steps
          items={[
            "Open the client's profile from the onboarding list.",
            "Read the reviewer's comments in the activity log.",
            "Click Edit Profile to make the requested corrections.",
            "Resubmit the profile once corrections are made.",
          ]}
        />
        <Heading>If Approved</Heading>
        <P>
          On approval, the profile becomes the client's live data. The
          profile preview page will now show options to activate the client's
          portal account and proceed with handoff.
        </P>
      </>
    ),
  },

  // ─── Account Activation ───
  {
    id: "account-activation",
    title: "Account Activation",
    subtitle: "Creating the client's portal account",
    icon: UserCircle,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    content: (
      <>
        <P>
          After the client's profile is approved, you can create their portal
          account so they can access the system. This step is only available
          once the profile has been approved by a QTD reviewer.
        </P>
        <Heading>How It Works</Heading>
        <Steps
          items={[
            "Go to the client's profile preview page.",
            "The Activate Account card will appear once the profile is approved.",
            "Click Activate Account — this sends the client an activation email.",
            "The client receives the email and sets their password to access the portal.",
          ]}
        />
        <P>
          If the client doesn't receive the email or needs it resent, you can
          resend the activation email from the client account card. You can
          also update the client's name or email before resending.
        </P>
      </>
    ),
  },

  // ─── Handoff ───
  {
    id: "handoff",
    title: "Client Handoff",
    subtitle: "Assigning accountants and completing the onboarding",
    icon: ArrowRightLeft,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    content: (
      <>
        <P>
          Handoff is the final step of the onboarding process. It assigns
          accountants to the client and creates a frozen snapshot of the
          client's profile at that point in time.
        </P>
        <Heading>How to Perform a Handoff</Heading>
        <Steps
          items={[
            "Go to the client's profile preview page (the client must have an activated account).",
            "The Handoff card will appear below the account activation card.",
            "Click Handoff — this assigns the accountants and creates the archive snapshot.",
          ]}
        />
        <Heading>What Happens After Handoff</Heading>
        <BulletList
          items={[
            "CSD and OOS accountants are assigned to the client.",
            "A frozen archive snapshot of the client's profile is saved — this captures the client's information exactly as it was at handoff time.",
            "You will always have access to this snapshot from your Client Onboarding list.",
            "If you are also assigned as an accountant on this client, you will additionally see the live client details page (which may differ from the snapshot as the profile gets updated over time).",
            "The Manager can then set the client's status to Active Client when ready.",
          ]}
        />
        <Tip>
          You can assign yourself as one of the accountants during handoff.
          Only the Manager can reassign accountants after handoff is complete.
        </Tip>
      </>
    ),
  },

  // ─── Client Snapshot ───
  {
    id: "client-snapshot",
    title: "Client Snapshot",
    subtitle: "The frozen archive of a handed-off client",
    icon: Archive,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    content: (
      <>
        <P>
          After a client is handed off, a frozen snapshot of their profile is
          created and preserved. This snapshot shows the client's information
          exactly as it was at the moment of handoff — it does not update when
          the live profile changes.
        </P>
        <Heading>When You See the Snapshot</Heading>
        <P>
          When you click a handed-off client from the Client Onboarding list,
          you'll be taken to the snapshot view. A banner at the top indicates
          you're viewing a frozen snapshot, not the live profile.
        </P>
        <Heading>Snapshot vs. Live Client Details</Heading>
        <BulletList
          items={[
            "Snapshot — frozen at handoff time, read-only, always accessible from your onboarding list.",
            "Live Client Details — current profile data, may have been updated by assigned accountants. Only visible if you are also assigned as an accountant on this client.",
          ]}
        />
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
        <Heading>Creating Tasks</Heading>
        <P>
          You can create tasks individually using the New Task button, or import
          them in bulk via the Import button. When creating a single task, you'll
          select the client, category, sub-category, task name, and deadline
          using cascading dropdowns. You can also create new categories and task
          names inline.
        </P>
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
          The Client List shows all clients assigned to you as an accountant
          (post-handoff). This is separate from the Client Onboarding list,
          which shows clients you created and onboarded.
        </P>
        <Heading>Client Details</Heading>
        <P>
          Click a client to view their full live profile — business
          information, registration details, contact persons, and more. The
          profile is organized into expandable sections that load on demand.
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

        <Heading>Client Status Distribution</Heading>
        <P>
          A donut chart showing the breakdown of your clients by status:
          Onboarding, Active, Offboarding, and Inactive. The center displays
          the total client count. This chart is unique to OOS users and helps
          you see the overall state of your client portfolio at a glance.
        </P>
      </>
    ),
  },

  // ─── Client Offboarding ───
  {
    id: "client-offboarding",
    title: "Client Offboarding",
    subtitle: "Manage clients being offboarded",
    icon: UserMinus,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    content: (
      <>
        <P>
          When a Manager initiates offboarding for a client, you may be assigned
          as the offboarding accountant. You'll receive a notification and the
          client will appear in your Client Offboarding list.
        </P>

        <Heading>Client Offboarding List</Heading>
        <P>
          This page shows all clients where you are the assigned offboarding
          accountant. The table displays the end-of-engagement date, deactivation
          date, letter status, and tax records protection status. Click any row
          to open the client's details.
        </P>

        <Heading>Sending the End of Engagement Letter</Heading>
        <Steps
          items={[
            "Open the client's details page — you'll see an offboarding banner at the top.",
            "Click \"Send End of Engagement Letter\" to open the template picker.",
            "Select a template from the list, or create a new one using the rich text editor.",
            "Preview the template content, then click Send Letter.",
            "The letter will be emailed to all users linked to the client's portal accounts, regardless of account status.",
          ]}
        />

        <Heading>Managing Templates</Heading>
        <P>
          You can create, edit, and delete end-of-engagement letter templates
          directly from the send modal. Templates are shared — any template you
          create will be available for future use by you and managers.
        </P>

        <Tip>
          After sending the letter, the banner will update to show "Sent" status.
          You can resend the letter at any time if needed.
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
            "Excess — beyond the monthly cap, billed at the excess rate.",
            "Courtesy — manually flagged, doesn't count toward billing.",
          ]}
        />
        <P>
          When a log is approved, the system recomputes all approved logs for
          that client and month in chronological order. Once cumulative hours
          exceed the client's included-hours cap, remaining logs become Excess.
          If no consultation config exists for the client, all non-courtesy logs
          default to Excess.
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
            "Offboarding Assigned — you've been assigned as the offboarding accountant for a client.",
            "Profile Approved — a client profile you submitted was approved.",
            "Profile Rejected — a client profile you submitted was rejected.",
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
