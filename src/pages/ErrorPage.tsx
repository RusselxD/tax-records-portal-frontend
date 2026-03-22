import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const message = is404
    ? "The page you're looking for doesn't exist or may have been moved."
    : "Something unexpected went wrong. Please try again or return to your dashboard.";

  const code = is404 ? "404" : "Error";

  const handleReload = () => {
    window.location.href = "/";
  };

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

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="h-1 bg-accent" />
          <div className="px-10 py-12 flex flex-col items-center text-center">
            <div className="relative mb-6 select-none">
              <span className="text-[100px] font-bold leading-none tracking-tight text-accent/10">
                {is404 ? "404" : "500"}
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-[52px] font-bold text-primary tracking-tight leading-none">
                {code}
              </span>
            </div>

            <div className="w-8 h-0.5 bg-accent rounded-full mb-5" />

            <h1 className="text-lg font-semibold text-primary mb-2">
              {is404 ? "Page not found" : "Something went wrong"}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              {message}
            </p>

            <button
              onClick={handleReload}
              className="w-full bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Upturn. All rights reserved.
      </p>
    </div>
  );
}
