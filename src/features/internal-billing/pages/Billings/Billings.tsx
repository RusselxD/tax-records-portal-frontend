import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, AlertTriangle, Plus, X } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { invoiceAPI } from "../../../../api/invoice";
import { getErrorMessage } from "../../../../lib/api-error";
import { Pagination, Button } from "../../../../components/common";
import type { PageResponse, InvoiceListItemResponse } from "../../../../types/invoice";
import BillingsTable from "./components/BillingsTable";

const PAGE_SIZE = 20;

export default function Billings() {
  usePageTitle("Billings");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const clientId = searchParams.get("clientId") || undefined;

  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<InvoiceListItemResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await invoiceAPI.getInvoices({ clientId, page, size: PAGE_SIZE });
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [clientId, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clearFilter = () => {
    setSearchParams({});
    setPage(0);
  };

  const clientName = clientId && data?.content.length
    ? data.content[0].clientName
    : null;

  const createUrl = clientId
    ? `/internal-billing/billings/new?clientId=${clientId}`
    : "/internal-billing/billings/new";

  const invoices = data?.content ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {clientName && (
            <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-primary">
              {clientName}
              <button onClick={clearFilter} className="ml-1 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        <Button onClick={() => navigate(createUrl)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Create Invoice
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isLoading && !data ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle className="h-5 w-5 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">{error}</p>
            <Button variant="secondary" onClick={fetchData}>Retry</Button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-gray-400">
            No invoices found.
          </div>
        ) : (
          <BillingsTable
            invoices={invoices}
            onRefresh={fetchData}
          />
        )}

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
