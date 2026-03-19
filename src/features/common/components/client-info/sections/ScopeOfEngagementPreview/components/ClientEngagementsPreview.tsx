import type { ScopeOfEngagementDetails, RegisteredBookEntry } from "../../../../../../../types/client-info";
import { BOOK_OF_ACCOUNTS_LABELS } from "../../../enum-labels";
import { TextDisplay, EnumDisplay, FileDisplay, RichTextPreview } from "../../../field-displays";
import ConsultationHoursPreview from "./ConsultationHoursPreview";
import SubsectionHeading from "../../SubsectionHeading";

function bookHasData(book: RegisteredBookEntry): boolean {
  return !!(book.bookName || book.notes);
}

export default function ClientEngagementsPreview({ data }: { data: ScopeOfEngagementDetails }) {
  const hasBooks = data.registeredBooks.some(bookHasData);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
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

      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <RichTextPreview label="Bookkeeping Process" value={data.bookkeepingProcess} />
        <RichTextPreview label="SSS, PhilHealth, HDMF Engagement" value={data.sssPhilhealthHdmfEngagement} />
        <RichTextPreview label="Payment Assistance" value={data.paymentAssistance} />
      </div>

      <SubsectionHeading label="Consultation Hours" />
      <ConsultationHoursPreview data={data.consultationHours} />
    </div>
  );
}
