import {
  Users,
  Receipt,
  CreditCard,
  Upload,
  UserCircle,
} from "lucide-react";
import { P, Heading, Steps, BulletList, StatusTable, Tip } from "./shared";
import type { HelpSection } from "../types";

export const billingSections: HelpSection[] = [
  // ─── Clients ───
  {
    id: "clients",
    title: "Billing Clients",
    subtitle: "View clients and their billing overview",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    content: (
      <>
        <P>
          The Clients page shows all clients with their billing summary —
          total invoices, unpaid/partially paid counts, and outstanding
          balance. Click any client to navigate to their invoice list.
        </P>
        <Heading>Client Table</Heading>
        <BulletList
          items={[
            "Client Name — the registered business name.",
            "Total Invoices — all invoices ever created for this client.",
            "Unpaid / Partially Paid — invoices that still have an outstanding balance.",
            "Total Amount Due — sum of all invoice amounts.",
            "Total Balance — sum of remaining balances across all unpaid invoices.",
          ]}
        />
      </>
    ),
  },

  // ─── Billings ───
  {
    id: "billings",
    title: "Invoices",
    subtitle: "Create, manage, and track invoices",
    icon: Receipt,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    content: (
      <>
        <P>
          The Billings page lists all invoices across all clients. Use the
          search bar and column filters (Client, Status) to find specific
          invoices.
        </P>

        <Heading>Creating an Invoice</Heading>
        <Steps
          items={[
            "Click Create Invoice.",
            "Select the client, enter the invoice number and amount due.",
            "Set the invoice date and payment terms (Due on Receipt, Net 3, Net 5, Net 7, or Net 15) — the due date is auto-computed from the invoice date.",
            "Optionally add a description and file attachments.",
            "Review in the confirmation modal, then confirm.",
          ]}
        />

        <Heading>Invoice Actions</Heading>
        <BulletList
          items={[
            "Send Email — emails the invoice details (number, dates, amount, description) to the client's point-of-contact email and all portal account emails. Any attached files are included in the email.",
            "Receive Payment — records a payment against the invoice.",
            "Void — marks the invoice as void. No further payments can be applied, and voiding cannot be undone. Existing payment records are preserved.",
            "Delete — permanently removes the invoice and all its payment records.",
          ]}
        />

        <Heading>Invoice Statuses</Heading>
        <StatusTable
          rows={[
            { status: "Unpaid", color: "bg-red-50 text-red-700", description: "No payments recorded yet." },
            { status: "Partially Paid", color: "bg-amber-50 text-amber-700", description: "Some payments received but balance remains." },
            { status: "Fully Paid", color: "bg-emerald-50 text-emerald-700", description: "All payments received, balance is zero." },
            { status: "Void", color: "bg-gray-100 text-gray-600", description: "Invoice voided. No further action possible." },
          ]}
        />
      </>
    ),
  },

  // ─── Payments ───
  {
    id: "payments",
    title: "Receiving Payments",
    subtitle: "Record and manage payments on invoices",
    icon: CreditCard,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    content: (
      <>
        <P>
          Payments are recorded from the invoice detail page. Each payment
          tracks the date, amount, and optional supporting files.
        </P>

        <Heading>Recording a Payment</Heading>
        <Steps
          items={[
            "Open an invoice and click Receive Payment.",
            "Enter the payment date and amount.",
            "Optionally attach supporting files (receipts, bank statements).",
            "Click Record Payment and confirm in the modal.",
          ]}
        />

        <Heading>Editing a Payment</Heading>
        <P>
          Each payment in the Payment History section has a small edit icon.
          Click it to update the date, amount, or attachments.
        </P>

        <Heading>Sending Receipts</Heading>
        <P>
          Click the send icon next to any payment to email a receipt to the
          client. You can resend at any time.
        </P>

        <Tip>
          The outstanding balance and remaining after payment are shown in
          real-time as you enter the amount, so you can verify before
          submitting.
        </Tip>
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
          All file uploads are validated before uploading. Files that don't
          meet the requirements will be skipped with an error message.
        </P>
        <Heading>Document Uploads</Heading>
        <BulletList
          items={[
            "Accepted formats: PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, JPEG, PNG, GIF, WEBP, DAT",
            "Maximum file size: 25MB per file",
            "Applies to: invoice attachments and payment receipts",
          ]}
        />
      </>
    ),
  },

  // ─── Your Profile ───
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
