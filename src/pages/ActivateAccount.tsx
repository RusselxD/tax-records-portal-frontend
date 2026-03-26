import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getErrorMessage, isRateLimitedError } from "../lib/api-error";
import { usersAPI } from "../api/users";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { getDashboardUrl } from "../constants";
import { Alert, Button, Card, Input } from "../components/common";

const PageHeader = ({ email }: { email: string }) => (
  <div className="mb-8 flex flex-col items-center">
    <img src="/upturn.svg" alt="Upturn Logo" className="mb-4 h-10 w-auto" />
    <h1 className="text-xl font-semibold text-primary">Set Your Password</h1>
    <p className="mt-1 text-sm text-gray-500">
      Create a password for <span className="font-medium text-primary">{email}</span>
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center gap-3 py-8">
    <div className="skeleton h-5 w-48 rounded" />
    <div className="skeleton h-4 w-32 rounded" />
  </div>
);

const InvalidTokenState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center gap-4 py-8">
    <Alert variant="error">{message}</Alert>
    <Button variant="secondary" onClick={() => (window.location.href = "/auth/login")}>
      Go to Login
    </Button>
  </div>
);

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

export default function ActivateAccount() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();
  const { toastSuccess } = useToast();

  const [email, setEmail] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setTokenError("Invalid activation link.");
        setIsValidating(false);
        return;
      }
      try {
        const res = await usersAPI.validateActivationToken(token);
        if (res.valid) {
          setEmail(res.email);
        } else {
          setTokenError("This activation link is invalid or has expired.");
        }
      } catch (err) {
        setTokenError(getErrorMessage(err, "This activation link is invalid or has expired."));
      } finally {
        setIsValidating(false);
      }
    };
    validate();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validatePasswords(password, confirmPassword);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await usersAPI.setPassword({ token: token!, password });
      const user = loginWithTokens(response);
      toastSuccess("Account Activated", "Your password has been set successfully.");
      navigate(getDashboardUrl(user.roleKey), { replace: true });
    } catch (err) {
      if (isRateLimitedError(err)) {
        setSubmitError("Too many attempts. Please wait a moment and try again.");
      } else {
        setSubmitError(getErrorMessage(err, "Failed to set password. Please try again."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card accentBorder>
      <div className="p-8">
        {isValidating && <LoadingState />}

        {!isValidating && tokenError && (
          <InvalidTokenState message={tokenError} />
        )}

        {!isValidating && !tokenError && (
          <>
            <PageHeader email={email} />

            {submitError && (
              <Alert variant="error" className="mb-4">
                {submitError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                autoComplete="new-password"
              />

              <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              <Button type="submit" isLoading={isSubmitting} className="w-full">
                {isSubmitting ? "Setting password..." : "Set Password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </Card>
  );
}
