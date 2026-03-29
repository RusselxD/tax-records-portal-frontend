import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Receipt } from "lucide-react";
import { invoiceAPI } from "../../../../../api/invoice";
import { getErrorMessage } from "../../../../../lib/api-error";
import { formatCurrency, formatDate } from "../../../../../lib/formatters";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hasPermission, Permission } from "../../../../../constants";
import { getRolePrefix } from "../../../../../constants/roles";
import InvoiceStatusBadge from "../../../../../components/common/InvoiceStatusBadge";
import type { ClientInvoiceSidebarItem, ClientInvoiceFilter } from "../../../../../types/invoice";
import { SidebarCard } from "../../../components/client-info";

const PAGE_SIZE = 10;

function InvoiceRow({ invoice }: { invoice: ClientInvoiceSidebarItem }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = hasPermission(user?.permissions, Permission.BILLING_MANAGE);
  const prefix = getRolePrefix(user?.roleKey ?? "");

  const handleClick = () => {
    if (canManage) {
      navigate(`/${prefix}/billings/${invoice.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${canManage ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-primary">{invoice.invoiceNumber}</span>
        <InvoiceStatusBadge status={invoice.status} />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className={invoice.isOverdue ? "text-red-500 font-medium" : ""}>
          Due {formatDate(invoice.dueDate)}
        </span>
        <span className="font-medium text-gray-700">{formatCurrency(invoice.balance)}</span>
      </div>
    </div>
  );
}

function InvoiceSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="px-4 py-3 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded skeleton" />
            <div className="h-5 w-16 rounded-full skeleton" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-24 rounded skeleton" />
            <div className="h-3 w-16 rounded skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ClientBilling({ clientId }: { clientId: string }) {
  const [invoices, setInvoices] = useState<ClientInvoiceSidebarItem[]>([]);
  const [filter, setFilter] = useState<ClientInvoiceFilter>("outstanding");
  const [totalBalance, setTotalBalance] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = useCallback(async (p: number, f: ClientInvoiceFilter, append: boolean) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const data = await invoiceAPI.getClientInvoices(clientId, { page: p, size: PAGE_SIZE, filter: f });
      setInvoices((prev) => append ? [...prev, ...data.content] : data.content);
      setTotalBalance(data.totalBalance);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchInvoices(0, filter, false);
  }, [filter, fetchInvoices]);

  const hasMore = page < totalPages - 1;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    fetchInvoices(page + 1, filter, true);
  }, [hasMore, isLoadingMore, page, filter, fetchInvoices]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore(); },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  const handleFilterChange = (f: ClientInvoiceFilter) => {
    if (f === filter) return;
    setFilter(f);
    setInvoices([]);
    setPage(0);
  };

  return (
    <SidebarCard title="Billing">
      {/* Balance + filter toggle */}
      <div className="px-4 py-3 border-b border-gray-100">
        {totalBalance > 0 && (
          <div className="mb-2.5">
            <p className="text-xs text-gray-400">Outstanding Balance</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalBalance)}</p>
          </div>
        )}
        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
          <button
            onClick={() => handleFilterChange("outstanding")}
            className={`flex-1 text-xs font-medium py-1.5 rounded transition-colors ${
              filter === "outstanding"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Outstanding
          </button>
          <button
            onClick={() => handleFilterChange("all")}
            className={`flex-1 text-xs font-medium py-1.5 rounded transition-colors ${
              filter === "all"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {isLoading ? (
        <InvoiceSkeleton />
      ) : error ? (
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-gray-500 mb-2">{error}</p>
          <button onClick={() => fetchInvoices(0, filter, false)} className="text-xs text-accent hover:text-accent-hover font-medium">
            Retry
          </button>
        </div>
      ) : invoices.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <Receipt className="h-5 w-5 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            {filter === "outstanding" ? "No outstanding invoices" : "No invoices yet"}
          </p>
        </div>
      ) : (
        <div className="max-h-[50dvh] overflow-y-auto">
          {invoices.map((inv) => (
            <InvoiceRow key={inv.id} invoice={inv} />
          ))}
          {hasMore && (
            <div ref={sentinelRef} className="px-4 py-3 text-center">
              {isLoadingMore && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400 mx-auto" />
              )}
            </div>
          )}
        </div>
      )}
    </SidebarCard>
  );
}
