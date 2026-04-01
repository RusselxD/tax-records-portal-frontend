import { uid } from "../../../../../../../../lib/uid";
import { Plus, Trash2 } from "lucide-react";
import { Input, Button, Dropdown, MultiFileDropZone } from "../../../../../../../../components/common";
import type {
  ScopeOfEngagementDetails,
  RegisteredBookEntry,
  RichTextContent,
  BookOfAccountsType,
} from "../../../../../../../../types/client-info";
import { useNewClient } from "../../../../context/NewClientContext";
import RichTextEditor from "../../RichTextEditor";

const taxComplianceDescription = (
  <div className="space-y-2">
    <p>Please clearly explain how the tax compliance process is performed, starting from the documents received from the client up to the preparation and filing of the tax returns. This should describe how the source documents provided by the client (such as sales invoices, official receipts, purchase invoices, expense receipts, and other supporting documents) are processed and recorded. For example, the documents received may first be recorded in the bookkeeping file, such as the transactional journal, sales and purchases schedules, and VAT workings. Based on these records, the necessary tax working papers are then prepared to compute the applicable taxes (e.g., VAT, withholding taxes, or other relevant taxes). The prepared working papers are subsequently reviewed internally and submitted to the client for approval before the tax returns are finalized and filed with the BIR.</p>
    <p>In cases where the client provides summary reports of sales and purchases, please explain the procedures performed to verify the reliability of the summaries. This may include copying the summarized data into the working files, performing sample checks against the underlying invoices or receipts, and validating that the totals agree with the supporting documents. Once verification is completed, the tax working papers are prepared based on the verified data, and these are then forwarded to the client for review and approval prior to filing.</p>
    <p className="font-medium">Objective: To ensure that whoever handles the account clearly understands the complete process of tax compliance, from document collection, verification, recording, preparation of working papers, client approval, and final tax filing.</p>
  </div>
);

const bookkeepingProcessDescription = (
  <div className="space-y-2">
    <p>Please indicate how bookkeeping is performed for the client. The process may vary depending on the agreed arrangement:</p>
    <ol className="list-decimal pl-4 space-y-1.5">
      <li><span className="font-medium">Based on Supporting Documents</span> — The client submits invoices, receipts, and expense documents. Documents are reviewed and recorded in the Transactional Journal or accounting software (e.g., QuickBooks, Xero, or other platforms). These records are used to generate and print the Loose-Leaf Books of Accounts.</li>
      <li><span className="font-medium">Based on Client Summary</span> — The client provides summary reports of sales, purchases, or expenses. Data is recorded as submitted, usually by copying the information into the Transactional Journal and VAT workings. From these records, the Books of Accounts are generated for Loose-Leaf printing.</li>
      <li><span className="font-medium">Client Maintains Their Own Books</span> — The client updates and maintains their own Books of Accounts. Our role is limited to periodic follow-ups or confirmations that the books are regularly updated. The client may also be requested to send copies or photos of the updated books for monitoring purposes.</li>
    </ol>
    <p>If none of the arrangements above apply, please clearly explain the actual bookkeeping process being followed.</p>
    <p className="font-medium">Objective: To ensure that the assigned staff clearly understands how bookkeeping is performed and who is responsible for maintaining the client's Books of Accounts.</p>
  </div>
);

const sssPhilhealthHdmfDescription = (
  <div className="space-y-2">
    <p>Please indicate how SSS, PhilHealth, and Pag-IBIG (HDMF) contributions are handled for the client. The process may vary depending on the agreed arrangement:</p>
    <ol className="list-decimal pl-4 space-y-1.5">
      <li><span className="font-medium">Client Handles the Processing and Payment</span> — The client is responsible for preparing, filing, and paying the contributions to SSS, PhilHealth, and Pag-IBIG. Our role is limited to collecting copies of the payment confirmations, official receipts, or remittance reports for recording and reporting purposes.</li>
      <li><span className="font-medium">Assistance in Preparation of Remittance Documents</span> — Based on the payroll summary provided by the client, we may assist in preparing the required remittance details or reference numbers (e.g., PRN, SPA, or similar reference documents). The client remains responsible for processing and completing the actual payment or remittance.</li>
      <li><span className="font-medium">Other Arrangements</span> — If the process is different from the arrangements above, please clearly explain how the SSS, PhilHealth, and Pag-IBIG contributions are prepared, processed, and paid, including the responsibilities of both our team and the client.</li>
    </ol>
    <p className="font-medium">Objective: To ensure that the assigned staff clearly understands how statutory contributions are prepared, processed, and recorded, and who is responsible for the remittance of SSS, PhilHealth, and Pag-IBIG contributions.</p>
  </div>
);

const BOOK_OF_ACCOUNTS_OPTIONS = [
  { value: "MANUAL", label: "Manual" },
  { value: "LOOSE_LEAF", label: "Loose Leaf" },
  { value: "CAS", label: "CAS" },
];

interface ClientEngagementsSubsectionProps {
  data: ScopeOfEngagementDetails;
  onUpdate: (fields: Partial<ScopeOfEngagementDetails>) => void;
}

export default function ClientEngagementsSubsection({
  data,
  onUpdate,
}: ClientEngagementsSubsectionProps) {
  const { uploadFile } = useNewClient();
  const updateBook = (index: number, fields: Partial<RegisteredBookEntry>) => {
    const updated = data.registeredBooks.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onUpdate({ registeredBooks: updated });
  };

  const addBook = () =>
    onUpdate({
      registeredBooks: [
        ...data.registeredBooks,
        { _uid: uid(), bookName: null, notes: null },
      ],
    });

  const removeBook = (index: number) =>
    onUpdate({
      registeredBooks: data.registeredBooks.filter((_, i) => i !== index),
    });

  return (
    <div>
      <div className="space-y-5">
        <RichTextEditor
          label="Tax Compliance"
          description={taxComplianceDescription}
          value={data.taxCompliance}
          onChange={(v: RichTextContent) => onUpdate({ taxCompliance: v })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown
            label="Book of Accounts"
            options={BOOK_OF_ACCOUNTS_OPTIONS}
            value={data.bookOfAccounts ?? ""}
            onChange={(v) =>
              onUpdate({
                bookOfAccounts: (v || null) as BookOfAccountsType | null,
              })
            }
            placeholder="Select type"
            portal
          />
          <Input
            label="Bookkeeping Permit No."
            value={data.bookkeepingPermitNo ?? ""}
            onChange={(e) =>
              onUpdate({ bookkeepingPermitNo: e.target.value || null })
            }
            placeholder="Enter permit no."
          />
        </div>

        <MultiFileDropZone
          label="Looseleaf Certificate & BIR Template"
          value={data.looseleafCertificateAndBirTemplate}
          onChange={(v) => onUpdate({ looseleafCertificateAndBirTemplate: v })}
          uploadFile={uploadFile}
        />

        {/* Registered Books */}
        <div>
          <h4 className="text-sm font-medium text-primary mb-2">
            Registered Books
          </h4>
          <div className="space-y-3">
            {data.registeredBooks.map((book, index) => (
              <div key={book._uid ?? index} className="flex items-end gap-3">
                <div className="grid flex-1 grid-cols-2 gap-4">
                  <Input
                    label="Book Name"
                    value={book.bookName ?? ""}
                    onChange={(e) =>
                      updateBook(index, {
                        bookName: e.target.value || null,
                      })
                    }
                    placeholder="e.g. General Journal"
                  />
                  <Input
                    label="Notes"
                    value={book.notes ?? ""}
                    onChange={(e) =>
                      updateBook(index, { notes: e.target.value || null })
                    }
                    placeholder="Notes"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeBook(index)}
                  className="mb-1 shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-status-rejected transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="secondary" onClick={addBook}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add Book
            </Button>
          </div>
        </div>

        <RichTextEditor
          label="Bookkeeping Process"
          description={bookkeepingProcessDescription}
          value={data.bookkeepingProcess}
          onChange={(v: RichTextContent) => onUpdate({ bookkeepingProcess: v })}
        />
        <RichTextEditor
          label="SSS / PhilHealth / HDMF Engagement"
          description={sssPhilhealthHdmfDescription}
          value={data.sssPhilhealthHdmfEngagement}
          onChange={(v: RichTextContent) => onUpdate({ sssPhilhealthHdmfEngagement: v })}
        />
        <RichTextEditor
          label="Payment Assistance"
          value={data.paymentAssistance}
          onChange={(v: RichTextContent) => onUpdate({ paymentAssistance: v })}
        />

        {/* Ad Hoc Tasks & Tax Consultations */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h4 className="text-sm font-semibold text-primary mb-4">
            Ad Hoc Tasks & Tax Consultations
          </h4>
          <div className="text-sm text-gray-600 leading-relaxed space-y-4">
            <p>
              The Firm shall provide ad hoc tax consultations via email, telephone, Messenger, Viber,
              and/or other similar means not requiring extensive study, free of charge for a maximum of:
            </p>
            <input
              type="text"
              value={data.consultationFreeAllowance ?? ""}
              onChange={(e) => onUpdate({ consultationFreeAllowance: e.target.value || null })}
              placeholder="e.g. thirty (30) minutes per month, on a non-cumulative basis"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-primary font-medium placeholder:text-gray-400 placeholder:font-normal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <p>
              Any consultation time in excess of the above shall be billed to the Client at the rate of:
            </p>
            <input
              type="text"
              value={data.consultationExcessRate ?? ""}
              onChange={(e) => onUpdate({ consultationExcessRate: e.target.value || null })}
              placeholder="e.g. Five Hundred Pesos (₱500.00) per hour, computed proportionately"
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-primary font-medium placeholder:text-gray-400 placeholder:font-normal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <div className="border-t border-gray-200 pt-3 mt-1">
              <p className="text-xs text-gray-500 leading-relaxed">
                Such consultations include responding to queries via electronic messaging platforms,
                as well as consultations conducted through in-person or online meetings and other
                ad hoc tasks as requested by the Client.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
