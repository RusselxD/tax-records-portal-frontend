import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import usePageTitle from "../../../hooks/usePageTitle";
import { invoiceAPI } from "../../../api/invoice";
import { getErrorMessage } from "../../../lib/api-error";
import { formatDate, formatCurrency } from "../../../lib/formatters";
import { Pagination, Button, ResponsiveTable } from "../../../components/common";
import type { CardField } from "../../../components/common/ResponsiveTable";
import InvoiceStatusBadge from "../../../components/common/InvoiceStatusBadge";
import type { PageResponse, ClientInvoiceListItem } from "../../../types/invoice";

const PAGE_SIZE = 20;

export default function Invoice() {
  usePageTitle("Invoice");
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<ClientInvoiceListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await invoiceAPI.getMyInvoices({ page, size: PAGE_SIZE });
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invoices = data?.content ?? [];

  const handleInvoiceClick = useCallback(
    (inv: ClientInvoiceListItem) => navigate(`/client/invoice/${inv.id}`),
    [navigate],
  );

  const primaryFields = useCallback(
    (inv: ClientInvoiceListItem): CardField[] => [
      { label: "Invoice", value: inv.invoiceNumber },
      {
        label: "Balance",
        value: (
          <span className="font-medium text-primary">{formatCurrency(inv.balance)}</span>
        ),
      },
      { label: "Status", value: <InvoiceStatusBadge status={inv.status} /> },
      {
        label: "Due Date",
        value: (
          <span className={inv.isOverdue ? "text-red-500 font-medium" : ""}>
            {formatDate(inv.dueDate)}
          </span>
        ),
      },
    ],
    [],
  );

  const secondaryFields = useCallback(
    (inv: ClientInvoiceListItem): CardField[] => [
      { label: "Amount Due", value: formatCurrency(inv.amountDue) },
    ],
    [],
  );

  const cardClassName = useCallback(
    (inv: ClientInvoiceListItem) => inv.isOverdue ? "border-l-4 border-l-red-400" : "",
    [],
  );

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <ResponsiveTable
          data={invoices}
          keyExtractor={(inv) => inv.id}
          primaryFields={primaryFields}
          secondaryFields={secondaryFields}
          onItemClick={handleInvoiceClick}
          cardClassName={cardClassName}
          isLoading={isLoading && !data}
          emptyMessage="No invoices yet."
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No.</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && !data ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <AlertTriangle className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">{error}</p>
                    <Button variant="secondary" onClick={fetchData}>Retry</Button>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">
                    No invoices yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => navigate(`/client/invoice/${inv.id}`)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${inv.isOverdue ? "border-l-4 border-l-red-400" : ""}`}
                    >
                      <td className="px-4 py-3 font-medium text-primary">{inv.invoiceNumber}</td>
                      <td className={`px-4 py-3 ${inv.isOverdue ? "text-red-500 font-medium" : "text-gray-600"}`}>
                        {formatDate(inv.dueDate)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-primary">{formatCurrency(inv.amountDue)}</td>
                      <td className="px-4 py-3 text-right font-medium text-primary">{formatCurrency(inv.balance)}</td>
                      <td className="px-4 py-3 text-center"><InvoiceStatusBadge status={inv.status} /></td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </ResponsiveTable>

        {data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
