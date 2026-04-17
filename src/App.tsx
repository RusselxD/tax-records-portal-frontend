import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { DownloadProvider } from "./contexts/DownloadContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { useIsMobile } from "./hooks/useMediaQuery";
import { router } from "./router";

function AppToastContainer() {
  const isMobile = useIsMobile();
  return (
    <ToastContainer
      hideProgressBar
      position={isMobile ? "bottom-center" : "top-right"}
      autoClose={4000}
      newestOnTop
      closeButton
    />
  );
}

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <NotificationsProvider>
          <ToastProvider>
            <DownloadProvider>
              <Suspense fallback={<PageLoader />}>
                <RouterProvider router={router} />
              </Suspense>
            </DownloadProvider>
            <AppToastContainer />
          </ToastProvider>
        </NotificationsProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}
