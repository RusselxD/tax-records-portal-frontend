import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardUrl } from "../constants";
import { Button } from "../components/common";

interface NotFoundProps {
  inline?: boolean;
}

export default function NotFound({ inline = false }: NotFoundProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAction = () => {
    if (inline) {
      navigate(-1);
    } else if (isAuthenticated && user) {
      navigate(getDashboardUrl(user.roleKey));
    } else {
      navigate("/auth/login");
    }
  };

  const card = (
    <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="h-1 bg-accent" />
      <div className="px-10 py-12 flex flex-col items-center text-center">
        <div className="relative mb-6 select-none">
          <span className="text-[100px] font-bold leading-none tracking-tight text-accent/10">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[52px] font-bold text-primary tracking-tight leading-none">
            404
          </span>
        </div>

        <div className="w-8 h-0.5 bg-accent rounded-full mb-5" />

        <h1 className="text-lg font-semibold text-primary mb-2">
          {inline ? "Record not found" : "Page not found"}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          {inline
            ? "The record you're looking for doesn't exist or may have been removed."
            : "The page you're looking for doesn't exist or may have been moved. Check the URL or return to your dashboard."}
        </p>

        <Button onClick={handleAction} className="w-full">
          {inline ? "Go Back" : isAuthenticated ? "Go to Dashboard" : "Back to Login"}
        </Button>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-sm">{card}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-3 mb-10">
        <img src="/upturn.svg" alt="Upturn" className="w-8 h-auto" />
        <div>
          <div className="font-semibold text-primary text-sm leading-tight">
            Upturn
          </div>
          <div className="text-xs text-gray-500 leading-tight">
            Tax Records Portal
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm">{card}</div>

      <p className="mt-8 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Upturn. All rights reserved.
      </p>
    </div>
  );
}
