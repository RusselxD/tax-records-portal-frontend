import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { router } from "./router";

export default function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <ToastProvider>
          <RouterProvider router={router} />
          <ToastContainer
            hideProgressBar
            position="top-right"
            autoClose={4000}
            newestOnTop
            closeButton={false}
            toastClassName="!rounded-lg !shadow-lg !p-0 !min-h-0 !mb-2"
            className="!w-auto sm:!w-[360px] !p-3 sm:!p-0"
          />
        </ToastProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}
