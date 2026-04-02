import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import usePageTitle from "../../../hooks/usePageTitle";
import { invoiceAPI } from "../../../api/invoice";
import { getErrorMessage } from "../../../lib/api-error";
import { formatCurrency } from "../../../lib/formatters";
import { SearchInput, Pagination, Button, ResponsiveTable } from "../../../components/common";
import type { CardField } from "../../../components/common/ResponsiveTable";
import type { PageResponse, BillingClientListItemResponse } from "../../../types/invoice";

const PAGE_SIZE = 20;

export default function Clients() {
  usePageTitle("Billing Clients");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<BillingClientListItemResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await invoiceAPI.getBillingClients({
        search: search || undefined,
        page,
        size: PAGE_SIZE,
      });
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const clients = data?.content ?? [];

  const keyExtractor = useCallback(
    (c: BillingClientListItemResponse) => c.clientId,
    [],
  );

  const primaryFields = useCallback(
    (c: BillingClientListItemResponse): CardField[] => [
      { label: "Client", value: c.clientName, stacked: true },
      {
        label: "Balance",
        value: <span className="font-medium text-primary">{formatCurrency(c.totalBalance)}</span>,
      },
    ],
    [],
  );

  const secondaryFields = useCallback(
    (c: BillingClientListItemResponse): CardField[] => [
      { label: "Total Invoices", value: c.totalInvoices },
      { label: "Unpaid", value: <span className="text-red-600">{c.unpaidInvoices}</span> },
      { label: "Partial", value: <span className="text-amber-600">{c.partiallyPaidInvoices}</span> },
      { label: "Paid", value: <span className="text-emerald-600">{c.fullyPaidInvoices}</span> },
      { label: "Amount Due", value: <span className="font-medium text-primary">{formatCurrency(c.totalAmountDue)}</span> },
    ],
    [],
  );

  const handleItemClick = useCallback(
    (c: BillingClientListItemResponse) => {
      navigate(`/internal-billing/billings?clientId=${c.clientId}`);
    },
    [navigate],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SearchInput
          placeholder="Search clients..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <ResponsiveTable
          data={clients}
          keyExtractor={keyExtractor}
          primaryFields={primaryFields}
          secondaryFields={secondaryFields}
          onItemClick={handleItemClick}
          isLoading={isLoading && !data}
          emptyMessage={search ? "No clients match your search." : "No clients found."}
        >
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[28%]">Client Name</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Total</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Unpaid</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Partial</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Paid</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[16%]">Amount Due</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[16%]">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && !data ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <AlertTriangle className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">{error}</p>
                    <Button variant="secondary" onClick={fetchData}>Retry</Button>
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    {search ? "No clients match your search." : "No clients found."}
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.clientId}
                    onClick={() => navigate(`/internal-billing/billings?clientId=${client.clientId}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-primary max-w-0">
                      <span className="block truncate" title={client.clientName}>{client.clientName}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{client.totalInvoices}</td>
                    <td className="px-4 py-3 text-right text-red-600">{client.unpaidInvoices}</td>
                    <td className="px-4 py-3 text-right text-amber-600">{client.partiallyPaidInvoices}</td>
                    <td className="px-4 py-3 text-right text-emerald-600">{client.fullyPaidInvoices}</td>
                    <td className="px-4 py-3 text-right font-medium text-primary">{formatCurrency(client.totalAmountDue)}</td>
                    <td className="px-4 py-3 text-right font-medium text-primary">{formatCurrency(client.totalBalance)}</td>
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
