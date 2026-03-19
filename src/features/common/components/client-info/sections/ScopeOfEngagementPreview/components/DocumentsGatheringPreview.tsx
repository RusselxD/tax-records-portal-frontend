import type { ScopeOfEngagementDetails } from "../../../../../../../types/client-info";
import { RichTextPreview } from "../../../field-displays";

export default function DocumentsGatheringPreview({ data }: { data: ScopeOfEngagementDetails }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
      <RichTextPreview label="Sales Invoices & Documents" value={data.salesInvoicesAndDocuments} />
      <RichTextPreview label="Purchase & Expense Documents" value={data.purchaseAndExpenseDocuments} />
      <RichTextPreview label="Payroll Documents" value={data.payrollDocuments} />
      <RichTextPreview label="SSS, PhilHealth, HDMF Documents" value={data.sssPhilhealthHdmfDocuments} />
      <RichTextPreview label="Business Permits, Licenses & Other Documents" value={data.businessPermitsLicensesAndOtherDocuments} />
      <RichTextPreview label="Additional Notes" value={data.additionalNotes} />
    </div>
  );
}
