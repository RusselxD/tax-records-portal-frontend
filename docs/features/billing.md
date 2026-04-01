# Billing

Billing is scoped to the BILLING (Internal Accounting) role. It manages invoices and payments for clients.

## Invoice Lifecycle

```
UNPAID → PARTIALLY_PAID → FULLY_PAID (terminal)
   ↓          ↓
  VOID       VOID (terminal)
```

| Status | Description |
|--------|------------|
| Unpaid | No payments recorded yet |
| Partially Paid | Some payments received, balance remains |
| Fully Paid | All payments received, balance is zero |
| Void | Invoice voided — irreversible, no further payments accepted |

## Invoice Creation

| Field | Details |
|-------|---------|
| Client | Select from all clients |
| Invoice Number | User-entered identifier |
| Amount Due | Total invoice amount |
| Invoice Date | Date of the invoice |
| Payment Terms | Due on Receipt (0 days), Net 3, Net 5, Net 7, Net 15 |
| Due Date | Auto-computed: invoice date + payment terms days |
| Description | Optional |
| Attachments | Optional file uploads |

Returns HTTP 201 on creation.

## Invoice Actions

### Send Email

Sends to the client's point-of-contact email + all portal account emails (deduplicated).

Email includes:
- Invoice number, date, due date
- Description
- Formatted amount (Philippine Peso format)
- Portal link
- Attached files (downloaded from R2, base64-encoded)

### Receive Payment

Records a payment against the invoice:
- Payment date and amount (required)
- Optional file attachments (receipts, bank statements)
- Real-time display of outstanding balance and remaining-after-payment

### Edit Payment

Each payment in the Payment History section can be edited — update date, amount, or attachments.

### Send Receipt

Emails a payment receipt to the client. Can be resent anytime.

### Void Invoice

- Marks the invoice as void permanently — **cannot be un-voided**
- Existing payment records are preserved (not deleted)
- Future payments are blocked with 400 error

### Delete Invoice

Permanently removes the invoice and all its payment records.

## Outstanding Balance

Real-time computed via native SQL: `SUM(amount_due - payments)` for UNPAID and PARTIALLY_PAID invoices. Not a denormalized field — always reflects current state.

## Client Outstanding Invoices

`GET /invoices/me/outstanding` returns invoices with `isOverdue: boolean` (server-computed). The frontend does not derive overdue status from the due date.

## Billing Clients Page

Shows all clients with their billing summary:

| Column | Description |
|--------|------------|
| Client Name | Registered business name |
| Total Invoices | All invoices ever created |
| Unpaid / Partially Paid | Invoices with outstanding balance |
| Total Amount Due | Sum of all invoice amounts |
| Total Balance | Sum of remaining balances across unpaid invoices |

Click a client to navigate to their invoice list.

## Client Portal View

Client users see their outstanding invoices with status, amount, due date, and overdue indicator.
