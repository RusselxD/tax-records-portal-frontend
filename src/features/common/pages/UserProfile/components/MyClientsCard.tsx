import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "../../../../../contexts/AuthContext";
import { usersAPI } from "../../../../../api/users";
import { getRolePrefix } from "../../../../../constants";
import type { AssignedClientItem } from "../../../../../types/user";

export default function MyClientsCard() {
  const { user } = useAuth();
  const [clients, setClients] = useState<AssignedClientItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const prefix = getRolePrefix(user!.roleKey);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await usersAPI.getMyClients(0);
        setClients(res.content);
        setHasMore(res.hasMore);
        setPage(0);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!hasMore || isFetchingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const nextPage = page + 1;
        setIsFetchingMore(true);
        const loadMore = async () => {
          try {
            const res = await usersAPI.getMyClients(nextPage);
            setClients((prev) => [...prev, ...res.content]);
            setHasMore(res.hasMore);
            setPage(nextPage);
          } catch {
            // ignore
          } finally {
            setIsFetchingMore(false);
          }
        };
        loadMore();
      },
      { threshold: 1 },
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, isFetchingMore, page]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-primary">Assigned Clients</h2>
        {!isLoading && (
          <span className="text-xs text-gray-400 font-medium">
            {clients.length}{hasMore ? "+" : ""} {clients.length === 1 && !hasMore ? "client" : "clients"}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No clients assigned.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          <ul className="divide-y divide-gray-100">
            {clients.map((client) => (
              <li key={client.id}>
                <Link
                  to={`${prefix}/client-details/${client.id}`}
                  className="flex items-center justify-between py-2.5 gap-3 group"
                >
                  <span className="text-sm text-gray-800 group-hover:text-primary transition-colors">
                    {client.clientName}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          <div ref={sentinelRef} className="h-1" />
          {isFetchingMore && (
            <div className="flex justify-center py-3">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
