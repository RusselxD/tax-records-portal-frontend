import type {
  ScopeOfEngagementDetails,
  RichTextContent,
} from "../../../../../../../../types/client-info";
import RichTextEditor from "../../RichTextEditor";

const SECTION_INSTRUCTION =
  "Please explain clearly and thoroughly how the client submits their documents, including the method or platform used (such as email, Google Drive, shared folders, accounting systems, or physical copies), the types of documents typically submitted, and the usual timing or schedule of submission (whether daily, weekly, monthly, or upon request). The explanation should describe the complete process followed by the client when providing documents so that any team member who will be assigned to this client can easily understand how documents are received and managed, ensuring smooth continuity of work and proper handling of the client's records.";

const FIELD_DESCRIPTIONS = {
  salesInvoices:
    "Please clearly explain the documents being requested from the client related to sales transactions, including Sales Invoices, BIR Form 2307, and other supporting sales documents. The explanation should specify the types of documents that the client needs to provide, such as Sales Invoices (SI), Service Invoices, Collection Receipts, Official Receipts (OR), Acknowledgment Receipts, and Delivery Receipts. In addition, if the client provides a Sales Summary, please describe the format or details required in the summary and provide a sample format to guide the client in preparing it properly. The objective is to ensure that whoever handles the account clearly understands what documents should be requested and collected to properly record and support the client's sales transactions.",
  purchaseAndExpense:
    "Please clearly explain the documents being requested from the client related to purchases and expenses, including the necessary supporting documents required for proper recording and verification. The explanation should specify the types of documents that the client needs to provide, such as Expense Vouchers with supporting attachments, Petty Cash Vouchers, Supplier Invoices and Receipts, and a Purchase Summary, if applicable. If the client submits a Purchase Summary, please describe the required details and provide a sample format to guide the client in preparing it correctly. The objective is to ensure that whoever handles the account clearly understands what documents should be requested and collected to properly record and support the client's purchase and expense transactions.",
  payroll:
    "Please clearly explain the documents being requested from the client related to payroll and employee compensation, including the necessary supporting documents required for proper recording, verification, and compliance. The explanation should specify the types of documents that the client needs to provide, such as the Payroll Summary, Employee Payslips, Employment Contracts for newly hired employees, and Updated or Revised Contracts for existing employees, if applicable. If the client submits a Payroll Summary, please describe the required details to be included, such as employee name, position, payroll period, gross compensation, statutory deductions (SSS, PhilHealth, Pag-IBIG, and withholding tax), and net pay, and provide a sample format to guide the client in preparing it correctly. The objective is to ensure that whoever handles the account clearly understands what payroll-related documents should be requested and collected to properly record payroll transactions and maintain adequate supporting documentation.",
  sssPhilhealthHdmf:
    "Please clearly explain the documents being requested from the client related to SSS, PhilHealth, and Pag-IBIG contribution remittances, including the necessary supporting documents required for proper recording, reconciliation, and verification. The explanation should specify the types of documents that the client needs to provide, such as payment confirmations, official receipts, validated payment forms, or online transaction records showing the remitted contributions to SSS, PhilHealth, and Pag-IBIG. If available, the client should also provide contribution summaries or schedules detailing the breakdown of employee and employer contributions for each payroll period. If the client maintains a contribution summary, please describe the required details to be included, such as employee name, payroll period, total compensation basis, employee share, employer share, and total contribution remitted. The objective is to ensure that whoever handles the account clearly understands what documents should be requested and collected to properly record statutory contribution expenses and verify that the required government remittances have been duly paid.",
  businessPermits:
    "Please clearly explain the documents being requested from the client related to business permits, licenses, and other regulatory or government-related documents, including the necessary supporting documents required for proper recording, compliance monitoring, and verification. The explanation should specify the types of documents that the client needs to provide, such as Business Permit or Mayor's Permit, Barangay Clearance, official receipts for business permit payments, Community Tax Certificate (CTC) payments, and payment confirmations for BIR Form 0605, including payments for LOA-related assessments, penalties, or other BIR obligations. The client should also provide documents related to loan transactions, such as loan agreements, loan proceeds received, and supporting documents for interest and principal payments. Other documents that may have an impact on accounting records or tax compliance should likewise be collected.",
  additionalNotes:
    "Please clearly identify and explain the procedures to be performed once the documents are received from the client. This includes specifying how each type of document should be reviewed and recorded. For example, if the documents received are individual receipts or invoices, indicate whether these should be recorded individually in the accounting records or summarized based on a prepared schedule. If the client provides a summary report or listing, clarify whether the summary should be fully verified against the supporting documents or if only selected samples will be checked for validation. The process should also indicate the extent of verification required, such as whether all supporting documents must be reviewed or whether a sampling approach is acceptable. The objective is to ensure that the person handling the account clearly understands the proper procedure for reviewing, validating, and recording the documents to maintain accuracy, completeness, and proper documentation in the accounting records.",
};

interface DocumentsGatheringSubsectionProps {
  data: ScopeOfEngagementDetails;
  onUpdate: (fields: Partial<ScopeOfEngagementDetails>) => void;
}

export default function DocumentsGatheringSubsection({
  data,
  onUpdate,
}: DocumentsGatheringSubsectionProps) {
  return (
    <div>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        {SECTION_INSTRUCTION}
      </p>
      <div className="space-y-4">
        <RichTextEditor
          label="Sales Invoices & Documents"
          description={FIELD_DESCRIPTIONS.salesInvoices}
          value={data.salesInvoicesAndDocuments}
          onChange={(v: RichTextContent) => onUpdate({ salesInvoicesAndDocuments: v })}
        />
        <RichTextEditor
          label="Purchase & Expense Documents"
          description={FIELD_DESCRIPTIONS.purchaseAndExpense}
          value={data.purchaseAndExpenseDocuments}
          onChange={(v: RichTextContent) => onUpdate({ purchaseAndExpenseDocuments: v })}
        />
        <RichTextEditor
          label="Payroll Documents"
          description={FIELD_DESCRIPTIONS.payroll}
          value={data.payrollDocuments}
          onChange={(v: RichTextContent) => onUpdate({ payrollDocuments: v })}
        />
        <RichTextEditor
          label="SSS / PhilHealth / HDMF Documents"
          description={FIELD_DESCRIPTIONS.sssPhilhealthHdmf}
          value={data.sssPhilhealthHdmfDocuments}
          onChange={(v: RichTextContent) => onUpdate({ sssPhilhealthHdmfDocuments: v })}
        />
        <RichTextEditor
          label="Business Permits, Licenses & Other Documents"
          description={FIELD_DESCRIPTIONS.businessPermits}
          value={data.businessPermitsLicensesAndOtherDocuments}
          onChange={(v: RichTextContent) => onUpdate({ businessPermitsLicensesAndOtherDocuments: v })}
        />
        <RichTextEditor
          label="Additional Notes"
          description={FIELD_DESCRIPTIONS.additionalNotes}
          value={data.additionalNotes}
          onChange={(v: RichTextContent) => onUpdate({ additionalNotes: v })}
        />
      </div>
    </div>
  );
}
