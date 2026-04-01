import type { ScopeOfEngagementDetails, RegisteredBookEntry } from "../../../../../../../types/client-info";
import { BOOK_OF_ACCOUNTS_LABELS } from "../../../enum-labels";
import { TextDisplay, EnumDisplay, FileDisplay, RichTextPreview } from "../../../field-displays";

function bookHasData(book: RegisteredBookEntry): boolean {
  return !!(book.bookName || book.notes);
}

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

export function hasClientEngagementsData(data: ScopeOfEngagementDetails): boolean {
  return !!(
    hasRichText(data.taxCompliance) ||
    data.bookOfAccounts ||
    data.bookkeepingPermitNo ||
    data.looseleafCertificateAndBirTemplate?.length > 0 ||
    data.registeredBooks.some(bookHasData) ||
    hasRichText(data.bookkeepingProcess) ||
    hasRichText(data.sssPhilhealthHdmfEngagement) ||
    hasRichText(data.paymentAssistance) ||
    data.consultationFreeAllowance ||
    data.consultationExcessRate
  );
}

export default function ClientEngagementsPreview({ data }: { data: ScopeOfEngagementDetails }) {
  if (!hasClientEngagementsData(data)) return null;

  const hasBooks = data.registeredBooks.some(bookHasData);

  const hasMiddleFields =
    hasRichText(data.bookkeepingProcess) ||
    hasRichText(data.sssPhilhealthHdmfEngagement) ||
    hasRichText(data.paymentAssistance);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        <RichTextPreview label="Tax Compliance" value={data.taxCompliance} />
        <EnumDisplay
          label="Book of Accounts"
          value={data.bookOfAccounts}
          labels={BOOK_OF_ACCOUNTS_LABELS}
        />
        <TextDisplay label="Bookkeeping Permit No." value={data.bookkeepingPermitNo} />
        <FileDisplay label="Loose Leaf Certificate & BIR Template" value={data.looseleafCertificateAndBirTemplate} />
      </div>

      {hasBooks && (
        <div>
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Registered Books
          </span>
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                    Book Name
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.registeredBooks.filter(bookHasData).map((book, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                  >
                    <td className="px-4 py-2.5 text-sm text-primary font-medium">
                      {book.bookName}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-primary">
                      {book.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasMiddleFields && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <RichTextPreview label="Bookkeeping Process" value={data.bookkeepingProcess} />
          <RichTextPreview label="SSS, PhilHealth, HDMF Engagement" value={data.sssPhilhealthHdmfEngagement} />
          <RichTextPreview label="Payment Assistance" value={data.paymentAssistance} />
        </div>
      )}

      {(data.consultationFreeAllowance || data.consultationExcessRate) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <TextDisplay label="Consultation Free Allowance" value={data.consultationFreeAllowance} />
          <TextDisplay label="Consultation Excess Rate" value={data.consultationExcessRate} />
        </div>
      )}
    </div>
  );
}
