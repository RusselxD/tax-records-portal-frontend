import type { ScopeOfEngagementDetails } from "../../../../../../../types/client-info";
import { RichTextPreview } from "../../../field-displays";

function hasRichText(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const v = value as { content?: unknown[] };
  if (!v.content || v.content.length === 0) return false;
  return v.content.some((node: unknown) => {
    const n = node as { type?: string; content?: unknown[] };
    if (n.type === "image") return true;
    return n.content && Array.isArray(n.content) && n.content.length > 0;
  });
}

export function hasDocumentsGatheringData(data: ScopeOfEngagementDetails): boolean {
  return (
    hasRichText(data.salesInvoicesAndDocuments) ||
    hasRichText(data.purchaseAndExpenseDocuments) ||
    hasRichText(data.payrollDocuments) ||
    hasRichText(data.sssPhilhealthHdmfDocuments) ||
    hasRichText(data.businessPermitsLicensesAndOtherDocuments) ||
    hasRichText(data.additionalNotes)
  );
}

export default function DocumentsGatheringPreview({ data }: { data: ScopeOfEngagementDetails }) {
  if (!hasDocumentsGatheringData(data)) return null;

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
