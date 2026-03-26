import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt, Loader2, AlertCircle } from "lucide-react";
import { invoiceAPI } from "../../../../../api/invoice";
import { formatCurrency, formatDate } from "../../../../../lib/formatters";
import type { ClientOutstandingInvoice } from "../../../../../types/invoice";
import InvoiceStatusBadge from "../../../../../components/common/InvoiceStatusBadge";

export default function OutstandingBilling() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<ClientOutstandingInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    invoiceAPI.getMyOutstanding()
      .then((data) => { if (!cancelled) setInvoices(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <Receipt className="h-4 w-4 text-accent" />
        <h2 className="text-sm font-semibold text-primary">Outstanding Billing</h2>
        {invoices.length > 0 && (
          <span className="ml-auto text-xs font-medium text-gray-400">{invoices.length}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <Receipt className="h-8 w-8 text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">No outstanding invoices</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {invoices.map((inv) => {
              const isOverdue = inv.dueDate < today;
              return (
                <button
                  key={inv.id}
                  onClick={() => navigate(`/client/invoice/${inv.id}`)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-primary">{inv.invoiceNumber}</span>
                    <InvoiceStatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {isOverdue && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
                      <span className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-gray-400"}`}>
                        Due {formatDate(inv.dueDate)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{formatCurrency(inv.balance)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
