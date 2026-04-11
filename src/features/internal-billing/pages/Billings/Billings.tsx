import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { invoiceAPI } from "../../../../api/invoice";
import { clientAPI } from "../../../../api/client";
import { getErrorMessage } from "../../../../lib/api-error";
import { Pagination, Button, SearchInput } from "../../../../components/common";
import type { PageResponse, InvoiceListItemResponse } from "../../../../types/invoice";
import type { LookupResponse } from "../../../../types/tax-record-task";
import BillingsTable from "./components/BillingsTable";

const PAGE_SIZE = 20;

export default function Billings() {
  usePageTitle("Billings");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledClientId = searchParams.get("clientId") || "";

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [clientId, setClientId] = useState(prefilledClientId);
  const [status, setStatus] = useState("");
  const [data, setData] = useState<PageResponse<InvoiceListItemResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [clients, setClients] = useState<LookupResponse[]>([]);

  useEffect(() => {
    let cancelled = false;
    const fetchClients = async () => {
      try {
        const data = await clientAPI.getActiveClients();
        if (!cancelled) setClients(data);
      } catch {
        console.warn("Failed to load client filter options");
      }
    };
    fetchClients();
    return () => { cancelled = true; };
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, size: PAGE_SIZE };
      if (clientId) params.clientId = clientId;
      if (status) params.status = status;
      if (search) params.search = search;
      const res = await invoiceAPI.getInvoices(params);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [clientId, status, search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (v: string) => { setSearch(v); setPage(0); };
  const handleClientChange = (v: string) => { setClientId(v); setPage(0); };
  const handleStatusChange = (v: string) => { setStatus(v); setPage(0); };

  const clientOptions = [
    { label: "All Clients", value: "" },
    ...clients.map((c) => ({ label: c.displayName, value: c.id })),
  ];

  const createUrl = clientId
    ? `/internal-billing/billings/new?clientId=${clientId}`
    : "/internal-billing/billings/new";

  const invoices = data?.content ?? [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between mb-4">
        <SearchInput
          placeholder="Search by invoice number or client..."
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-auto"
        />
        <Button onClick={() => navigate(createUrl)} className="w-full sm:w-auto shrink-0">
          <Plus className="h-4 w-4 mr-1.5" />
          Create Memorandum
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <BillingsTable
          invoices={invoices}
          isLoading={isLoading && !data}
          error={error}
          onRefresh={fetchData}
          clientOptions={clientOptions}
          clientFilter={clientId}
          onClientFilterChange={handleClientChange}
          statusFilter={status}
          onStatusFilterChange={handleStatusChange}
        />

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
