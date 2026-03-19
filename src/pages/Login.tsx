import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardUrl } from "../constants";
import { Alert, Button, Card, Input } from "../components/common";

interface LocationState {
  from?: { pathname: string };
}

const LoginHeader = () => (
  <div className="mb-8 flex flex-col items-center">
    <img src="/upturn.svg" alt="Upturn Logo" className="mb-4 h-10 w-auto" />
    <h1 className="text-xl font-semibold text-primary">Tax Records Portal</h1>
    <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
  </div>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState)?.from?.pathname;

  const handleSubmit = async (e: FormEvent) => {
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

  return (
    <Card accentBorder>
      <div className="p-8">
        <LoginHeader />

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
      </div>
    </Card>
  );
}
