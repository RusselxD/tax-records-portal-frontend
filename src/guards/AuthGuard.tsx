import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function SplashScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-primary gap-5">
      <div className="flex flex-col items-center gap-4">
        <img src="/upturn.svg" alt="Upturn" className="w-32 h-32" />
        <div className="text-center">
          <div className="text-2xl font-semibold text-white tracking-wide">Upturn</div>
          <div className="text-white/50 mt-0.5">Tax Records Portal</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[splashDot_1.2s_ease-in-out_infinite]" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[splashDot_1.2s_ease-in-out_infinite]" style={{ animationDelay: "200ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[splashDot_1.2s_ease-in-out_infinite]" style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  );
}

/**
 * Protects routes that require authentication.
 * Redirects to login page if user is not authenticated.
 */
export function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
