import { useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardUrl } from "../constants";
import { authAPI } from "../api/auth";
import { getErrorMessage, isRateLimitedError } from "../lib/api-error";
import { Alert, Button, Card, Input } from "../components/common";

const MIN_PASSWORD_LENGTH = 8;

const validatePasswords = (
  password: string,
  confirmPassword: string,
): { password?: string; confirmPassword?: string } => {
  const errors: { password?: string; confirmPassword?: string } = {};
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
};

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validatePasswords(password, confirmPassword);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await authAPI.resetPassword(token!, password);
      const user = loginWithTokens(response);
      navigate(getDashboardUrl(user.roleKey), { replace: true });
    } catch (err) {
      if (isRateLimitedError(err)) {
        setSubmitError("Too many attempts. Please wait a moment and try again.");
      } else {
        setSubmitError(getErrorMessage(err, "Invalid or expired reset link."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Card accentBorder>
        <div className="p-8">
          <div className="flex flex-col items-center gap-4 py-8">
            <Alert variant="error">Invalid reset link.</Alert>
            <Button variant="secondary" onClick={() => navigate("/auth/login")}>
              Go to Login
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card accentBorder>
      <div className="p-8">
        <div className="mb-8 flex flex-col items-center">
          <img src="/upturn.svg" alt="Upturn Logo" className="mb-4 h-10 w-auto" />
          <h1 className="text-xl font-semibold text-primary">Reset Your Password</h1>
          <p className="mt-1 text-sm text-gray-500">Enter a new password for your account</p>
        </div>

        {submitError && (
          <Alert variant="error" className="mb-4">
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="password"
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </Card>
  );
}
