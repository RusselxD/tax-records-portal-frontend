import { CheckCircle, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "react-toastify";

interface ToastContextValue {
  toastSuccess: (title: string, message?: string) => void;
  toastError: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function ToastContent({
  icon,
  iconBg,
  iconColor,
  title,
  message,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  message?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full ${iconBg} flex items-center justify-center`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-primary leading-snug">{title}</p>
        {message && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
}

const TOAST_STYLE_SUCCESS = {
  background: "#ffffff",
  borderLeft: "4px solid #16A34A",
  borderRadius: "0 7px 7px 0",
  boxShadow: "0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
  padding: "13px 14px",
};

const TOAST_STYLE_ERROR = {
  background: "#ffffff",
  borderLeft: "4px solid #DC2626",
  borderRadius: "0 7px 7px 0",
  boxShadow: "0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
  padding: "13px 14px",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastSuccess = useCallback((title: string, message?: string) => {
    toast(
      <ToastContent
        icon={<CheckCircle className="w-[13px] h-[13px]" strokeWidth={2.5} />}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        title={title}
        message={message}
      />,
      { icon: false, style: TOAST_STYLE_SUCCESS },
    );
  }, []);

  const toastError = useCallback((title: string, message?: string) => {
    toast(
      <ToastContent
        icon={<XCircle className="w-[13px] h-[13px]" strokeWidth={2.5} />}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        title={title}
        message={message}
      />,
      { icon: false, style: TOAST_STYLE_ERROR },
    );
  }, []);

  const value = useMemo(() => ({ toastSuccess, toastError }), [toastSuccess, toastError]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
