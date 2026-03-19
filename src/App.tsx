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
          <ToastContainer hideProgressBar={true} />
        </ToastProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}
