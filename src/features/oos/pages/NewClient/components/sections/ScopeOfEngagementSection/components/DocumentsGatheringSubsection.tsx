import type {
  ScopeOfEngagementDetails,
  RichTextContent,
} from "../../../../../../../../types/client-info";
import RichTextEditor from "../../RichTextEditor";

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
      <h3 className="text-sm font-semibold text-primary mb-3">
        A. Documents & Information Gathering
      </h3>
      <div className="space-y-4">
        <RichTextEditor
          label="Sales Invoices & Documents"
          value={data.salesInvoicesAndDocuments}
          onChange={(v: RichTextContent) => onUpdate({ salesInvoicesAndDocuments: v })}
        />
        <RichTextEditor
          label="Purchase & Expense Documents"
          value={data.purchaseAndExpenseDocuments}
          onChange={(v: RichTextContent) => onUpdate({ purchaseAndExpenseDocuments: v })}
        />
        <RichTextEditor
          label="Payroll Documents"
          value={data.payrollDocuments}
          onChange={(v: RichTextContent) => onUpdate({ payrollDocuments: v })}
        />
        <RichTextEditor
          label="SSS / PhilHealth / HDMF Documents"
          value={data.sssPhilhealthHdmfDocuments}
          onChange={(v: RichTextContent) => onUpdate({ sssPhilhealthHdmfDocuments: v })}
        />
        <RichTextEditor
          label="Business Permits, Licenses & Other Documents"
          value={data.businessPermitsLicensesAndOtherDocuments}
          onChange={(v: RichTextContent) => onUpdate({ businessPermitsLicensesAndOtherDocuments: v })}
        />
        <RichTextEditor
          label="Additional Notes"
          value={data.additionalNotes}
          onChange={(v: RichTextContent) => onUpdate({ additionalNotes: v })}
        />
      </div>
    </div>
  );
}
