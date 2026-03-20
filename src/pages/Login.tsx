import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardUrl } from "../constants";
import { authAPI } from "../api/auth";
import { getErrorMessage } from "../lib/api-error";
import { Alert, Button, Card, Input } from "../components/common";

interface LocationState {
  from?: { pathname: string };
  resetSuccess?: boolean;
}

const Logo = () => (
  <div className="mb-2 flex flex-col items-center">
    <img src="/upturn.svg" alt="Upturn Logo" className="mb-4 h-10 w-auto" />
    <h1 className="text-xl font-semibold text-primary">Tax Records Portal</h1>
  </div>
);

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<"login" | "forgot">("login");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const from = state?.from?.pathname;
  const resetSuccess = state?.resetSuccess;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      const redirectTo = from || getDashboardUrl(user.roleKey);
      navigate(redirectTo, { replace: true });
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (view === "forgot") {
    return (
      <ForgotPasswordForm
        initialEmail={email}
        onBack={() => setView("login")}
      />
    );
  }

  return (
    <>
      <Logo />
      <p className="text-center text-sm text-gray-500 mb-6">Sign in to your account</p>

      {resetSuccess && (
        <Alert variant="success" className="mb-4">
          Your password has been reset. Sign in with your new password.
        </Alert>
      )}

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          autoComplete="email"
        />

        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setView("forgot")}
          className="text-sm text-gray-500 hover:text-accent transition-colors"
        >
          Forgot password?
        </button>
      </div>
    </>
  );
}

function ForgotPasswordForm({
  initialEmail,
  onBack,
}: {
  initialEmail: string;
  onBack: () => void;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await authAPI.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Logo />

      {sent ? (
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-700">
            If an account exists with <span className="font-medium text-primary">{email}</span>, you'll receive a password reset link shortly.
          </p>
          <p className="text-sm text-gray-500">Check your email and follow the link to reset your password.</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 text-sm text-accent hover:text-accent-hover transition-colors font-medium"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-gray-500 mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="forgot-email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-gray-500 hover:text-accent transition-colors"
            >
              Back to sign in
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function Login() {
  return (
    <Card accentBorder>
      <div className="p-8">
        <LoginForm />
      </div>
    </Card>
  );
}
