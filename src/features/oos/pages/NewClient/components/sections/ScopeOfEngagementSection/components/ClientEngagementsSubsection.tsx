import { Plus, Trash2 } from "lucide-react";
import { Input, Button, Dropdown } from "../../../../../../../../components/common";
import type {
  ScopeOfEngagementDetails,
  RegisteredBookEntry,
  RichTextContent,
  BookOfAccountsType,
} from "../../../../../../../../types/client-info";
import FileUploadInput from "../../FileUploadInput";
import RichTextEditor from "../../RichTextEditor";
import ConsultationHoursSubsection from "./ConsultationHoursSubsection";

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
        { bookName: null, notes: null },
      ],
    });

  const removeBook = (index: number) =>
    onUpdate({
      registeredBooks: data.registeredBooks.filter((_, i) => i !== index),
    });

  return (
    <div>
      <h3 className="text-sm font-semibold text-primary mb-3">
        B. Client Engagements
      </h3>
      <div className="space-y-5">
        <RichTextEditor
          label="Tax Compliance"
          value={data.taxCompliance}
          onChange={(v: RichTextContent) => onUpdate({ taxCompliance: v })}
        />

        <div className="grid grid-cols-2 gap-4">
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

        <FileUploadInput
          label="Looseleaf Certificate & BIR Template"
          value={data.looseleafCertificateAndBirTemplate}
          onChange={(v) => onUpdate({ looseleafCertificateAndBirTemplate: v })}
        />

        {/* Registered Books */}
        <div>
          <h4 className="text-sm font-medium text-primary mb-2">
            Registered Books
          </h4>
          <div className="space-y-3">
            {data.registeredBooks.map((book, index) => (
              <div key={index} className="flex items-end gap-3">
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
          value={data.bookkeepingProcess}
          onChange={(v: RichTextContent) => onUpdate({ bookkeepingProcess: v })}
        />
        <RichTextEditor
          label="SSS / PhilHealth / HDMF Engagement"
          value={data.sssPhilhealthHdmfEngagement}
          onChange={(v: RichTextContent) => onUpdate({ sssPhilhealthHdmfEngagement: v })}
        />
        <RichTextEditor
          label="Payment Assistance"
          value={data.paymentAssistance}
          onChange={(v: RichTextContent) => onUpdate({ paymentAssistance: v })}
        />

        <ConsultationHoursSubsection data={data} onUpdate={onUpdate} />
      </div>
    </div>
  );
}
