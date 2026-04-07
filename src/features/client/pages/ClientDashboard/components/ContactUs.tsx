import { useState, useEffect, useRef } from "react";
import { Mail, Users, MessageCircle, X, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { clientMeAPI } from "../../../../../api/client-me";
import { UserAvatar } from "../../../../../components/common";

interface Accountant {
  id: string;
  name: string;
  email: string;
  position: string;
}

interface BillingContact {
  id: string;
  name: string;
  email: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors shrink-0"
      title="Copy email"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function ContactGroup({
  title,
  icon: Icon,
  contacts,
  isLoading,
}: {
  title: string;
  icon: React.ElementType;
  contacts: { id: string; name: string; email: string; subtitle?: string }[];
  isLoading: boolean;
}) {
  const allEmails = contacts.map((c) => c.email).join(",");

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-accent" />
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">{title}</p>
        </div>
        {!isLoading && contacts.length > 0 && (
          <a
            href={`mailto:${allEmails}`}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-accent transition-colors"
            title="Open all in mail app"
          >
            <ExternalLink className="h-3 w-3" />
            Mail all
          </a>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-2 px-1">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-300" />
          <span className="text-xs text-gray-400">Loading...</span>
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-xs text-gray-400 italic px-1 py-2">No contacts available.</p>
      ) : (
        <div className="space-y-1">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-2.5 px-1 py-1.5 rounded-md hover:bg-gray-50 group">
              <UserAvatar name={c.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{c.name}</p>
                {c.subtitle && <p className="text-xs text-gray-400 truncate">{c.subtitle}</p>}
                <p className="text-xs text-gray-400 truncate">{c.email}</p>
              </div>
              <CopyButton text={c.email} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContactUs() {
  const [open, setOpen] = useState(false);
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [billing, setBilling] = useState<BillingContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [acc, bil] = await Promise.allSettled([
        clientMeAPI.getAccountants(),
        clientMeAPI.getBillingContacts(),
      ]);
      if (cancelled) return;
      if (acc.status === "fulfilled") setAccountants(acc.value);
      if (bil.status === "fulfilled") setBilling(bil.value);
      setIsLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Contact panel */}
      <div
        className={`w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-200 origin-bottom-right ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-primary">Get in Touch</p>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-3 space-y-4">
          <ContactGroup
            title="Your Accountants"
            icon={Users}
            contacts={accountants.map((a) => ({ ...a, subtitle: a.position }))}
            isLoading={isLoading}
          />
          <div className="border-t border-gray-100" />
          <ContactGroup
            title="Billing Team"
            icon={Mail}
            contacts={billing}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* FAB */}
      <div className="relative">
        {!open && (
          <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-40" />
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative h-14 w-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center hover:bg-accent/90 transition-all active:scale-95"
          aria-label="Contact us"
        >
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
