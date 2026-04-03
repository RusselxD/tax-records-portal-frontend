import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
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
      closeButton={false}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <ToastProvider>
          <RouterProvider router={router} />
          <AppToastContainer />
        </ToastProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}
