import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, CreditCard, Ban, Trash2, Send, Info } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { invoiceAPI } from "../../../../api/invoice";
import { getErrorMessage, isNotFoundError } from "../../../../lib/api-error";
import { useToast } from "../../../../contexts/ToastContext";
import { useAuth } from "../../../../contexts/AuthContext";
import { Permission, hasPermission } from "../../../../constants/permissions";
import { getRolePrefix } from "../../../../constants/roles";
import NotFound from "../../../../pages/NotFound";
import { Button, ConfirmActionModal } from "../../../../components/common";
import { INVOICE_STATUS } from "../../../../types/invoice";
import type { InvoiceDetailResponse } from "../../../../types/invoice";
import InvoiceInfo from "./components/InvoiceInfo";
import PaymentHistory from "./components/PaymentHistory";
import ReceivePaymentForm from "./components/ReceivePaymentForm";

export default function InvoiceDetail() {
  usePageTitle("Invoice Detail");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();
  const { user } = useAuth();

  const canManage = hasPermission(user?.permissions, Permission.BILLING_MANAGE);
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const [invoice, setInvoice] = useState<InvoiceDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const fetchInvoice = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = canManage
        ? await invoiceAPI.getInvoice(id)
        : await invoiceAPI.getMyInvoice(id);
      setInvoice(data);
    } catch (err) {
      if (isNotFoundError(err)) {
        setNotFound(true);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, canManage]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (notFound) return <NotFound inline />;

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-6 w-6 text-gray-400 mb-3" />
        <p className="text-sm text-gray-500 mb-3">{error}</p>
        <Button variant="secondary" onClick={fetchInvoice}>Retry</Button>
      </div>
    );
  }

  const isVoid = invoice.status === INVOICE_STATUS.VOID;
  const isFullyPaid = invoice.status === INVOICE_STATUS.FULLY_PAID;
  const backPath = canManage ? `${prefix}/billings` : `${prefix}/invoice`;

  const handleSendEmail = async () => {
    if (isSendingEmail) return;
    setIsSendingEmail(true);
    try {
      await invoiceAPI.sendEmail(invoice.id);
      setInvoice((prev) => prev ? { ...prev, emailSent: true } : prev);
      toastSuccess("Invoice Sent", "The invoice has been emailed to the client.");
    } catch (err) {
      toastError(getErrorMessage(err, "Failed to send invoice email."));
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="pb-12">
      {/* No recipients warning — billing only */}
      {canManage && !invoice.hasEmailRecipients && !isVoid && (
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-5">
          <Info className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700">
            This client has no portal accounts. Create an account to enable sending invoices via email.
          </p>
        </div>
      )}

      {/* Actions — billing only */}
      {canManage && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-5">
          {/* Primary actions */}
          <div className="flex gap-2 sm:contents">
            {!isVoid && invoice.hasEmailRecipients && (
              <Button variant="secondary" onClick={handleSendEmail} disabled={isSendingEmail} className="flex-1 sm:flex-initial">
                {isSendingEmail ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Send className="h-4 w-4 mr-1.5" />}
                {invoice.emailSent ? "Resend Email" : "Send Email"}
              </Button>
            )}
            {!isVoid && !isFullyPaid && (
              <Button onClick={() => setShowPaymentForm(true)} className="flex-1 sm:flex-initial">
                <CreditCard className="h-4 w-4 mr-1.5" />
                Receive Payment
              </Button>
            )}
          </div>
          {/* Destructive actions */}
          <div className="flex gap-2 sm:contents">
            {!isVoid && (
              <Button variant="secondary" onClick={() => setShowVoidConfirm(true)} className="flex-1 sm:flex-initial">
                <Ban className="h-4 w-4 mr-1.5" />
                Void
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(true)} className="flex-1 sm:flex-initial">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {showPaymentForm && (
          <ReceivePaymentForm
            invoiceId={invoice.id}
            clientId={invoice.clientId}
            balance={invoice.balance}
            onSuccess={() => { setShowPaymentForm(false); fetchInvoice(); }}
            onCancel={() => setShowPaymentForm(false)}
          />
        )}

        <InvoiceInfo invoice={invoice} />
        <PaymentHistory
          invoiceId={invoice.id}
          clientId={invoice.clientId}
          payments={invoice.payments}
          hasEmailRecipients={canManage && invoice.hasEmailRecipients}
          canManage={canManage}
          onRefresh={fetchInvoice}
        />
      </div>

      {/* Confirm modals — billing only */}
      {showVoidConfirm && (
        <ConfirmActionModal
          setModalOpen={setShowVoidConfirm}
          onConfirm={() => invoiceAPI.voidInvoice(invoice.id)}
          title="Void Invoice"
          description={`This will mark invoice ${invoice.invoiceNumber} as void. The invoice will remain on record but no further payments can be applied.`}
          confirmLabel="Void Invoice"
          loadingLabel="Voiding..."
          confirmClassName="bg-amber-600 hover:bg-amber-700"
          onSuccess={() => { setShowVoidConfirm(false); fetchInvoice(); }}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmActionModal
          setModalOpen={setShowDeleteConfirm}
          onConfirm={() => invoiceAPI.deleteInvoice(invoice.id)}
          title="Delete Invoice"
          description={`This will permanently remove invoice ${invoice.invoiceNumber} and all its payment records. This action cannot be undone.`}
          confirmLabel="Delete Invoice"
          loadingLabel="Deleting..."
          confirmClassName="bg-red-600 hover:bg-red-700"
          onSuccess={() => navigate(backPath)}
        />
      )}
    </div>
  );
}
