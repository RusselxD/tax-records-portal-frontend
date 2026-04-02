import { CheckCircle, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "react-toastify";

interface ToastContextValue {
  toastSuccess: (title: string, message?: string) => void;
  toastError: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function ToastBody({
  icon,
  iconBg,
  iconColor,
  borderColor,
  title,
  message,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  title: string;
  message?: string;
}) {
  return (
    <div className={`flex items-start gap-3 bg-white rounded-lg border-l-4 ${borderColor} px-3.5 py-3 shadow-lg`}>
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

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastSuccess = useCallback((title: string, message?: string) => {
    toast(
      <ToastBody
        icon={<CheckCircle className="w-[13px] h-[13px]" strokeWidth={2.5} />}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        borderColor="border-l-green-500"
        title={title}
        message={message}
      />,
      { icon: false, className: "!bg-transparent !shadow-none !p-0 !min-h-0" },
    );
  }, []);

  const toastError = useCallback((title: string, message?: string) => {
    toast(
      <ToastBody
        icon={<XCircle className="w-[13px] h-[13px]" strokeWidth={2.5} />}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        borderColor="border-l-red-500"
        title={title}
        message={message}
      />,
      { icon: false, className: "!bg-transparent !shadow-none !p-0 !min-h-0" },
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
