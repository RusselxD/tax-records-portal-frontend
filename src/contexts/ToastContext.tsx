import { CheckCircle, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "react-toastify";

interface ToastContextValue {
  toastSuccess: (title: string, message?: string) => void;
  toastError: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastSuccess = useCallback((title: string, message?: string) => {
    toast(
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle
              style={{ width: 13, height: 13, color: "#16A34A" }}
              strokeWidth={2.5}
            />
          </div>
        </div>
        <div className="flex-1">
          <strong
            style={{
              color: "#1E2A3A",
              fontWeight: 600,
              fontSize: 13.5,
              display: "block",
              lineHeight: 1.3,
              fontFamily: "DM Sans, Inter, sans-serif",
            }}
          >
            {title}
          </strong>
          {message && (
            <p
              style={{
                color: "#6B7280",
                fontSize: 12.5,
                marginTop: 2,
                lineHeight: 1.45,
                fontFamily: "DM Sans, Inter, sans-serif",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>,
      {
        style: {
          background: "#ffffff",
          borderLeft: "4px solid #16A34A",
          borderRadius: "0 7px 7px 0",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          padding: "13px 14px",
        },
        icon: false,
      },
    );
  }, []);

  const toastError = useCallback((title: string, message?: string) => {
    toast(
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <XCircle
              style={{ width: 13, height: 13, color: "#DC2626" }}
              strokeWidth={2.5}
            />
          </div>
        </div>
        <div className="flex-1">
          <strong
            style={{
              color: "#1E2A3A",
              fontWeight: 600,
              fontSize: 13.5,
              display: "block",
              lineHeight: 1.3,
              fontFamily: "DM Sans, Inter, sans-serif",
            }}
          >
            {title}
          </strong>
          {message && (
            <p
              style={{
                color: "#6B7280",
                fontSize: 12.5,
                marginTop: 2,
                lineHeight: 1.45,
                fontFamily: "DM Sans, Inter, sans-serif",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>,
      {
        style: {
          background: "#ffffff",
          borderLeft: "4px solid #DC2626",
          borderRadius: "0 7px 7px 0",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          padding: "13px 14px",
        },
        icon: false,
      },
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
