import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { getErrorMessage, isNotFoundError } from "../../../../../lib/api-error";
import { clientAPI } from "../../../../../api/client";
import { useToast } from "../../../../../contexts/ToastContext";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Permission, hasPermission } from "../../../../../constants";
import type { ProfileUpdateReviewResponse } from "../../../../../types/client-profile";

interface ProfileUpdateReviewContextType {
  taskId: string;
  clientId: string | null;
  review: ProfileUpdateReviewResponse | null;
  isLoading: boolean;
  error: string | null;
  notFound: boolean;
  isReviewer: boolean;
  refetch: () => void;
  logsVersion: number;
  approveUpdate: (comment: string) => Promise<void>;
  rejectUpdate: (comment: string) => Promise<void>;
}

const ProfileUpdateReviewContext = createContext<ProfileUpdateReviewContextType | null>(null);

export function ProfileUpdateReviewProvider({
  taskId,
  children,
}: {
  taskId: string;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const { toastSuccess } = useToast();

  const [review, setReview] = useState<ProfileUpdateReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [logsVersion, setLogsVersion] = useState(0);
  const [version, setVersion] = useState(0);

  const isReviewer = hasPermission(user?.permissions, Permission.CLIENT_INFO_REVIEW);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    clientAPI.getProfileUpdateReview(taskId)
      .then((data) => {
        if (!cancelled) setReview(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isNotFoundError(err)) {
          setNotFound(true);
        } else {
          setError(getErrorMessage(err, "Failed to load profile update review."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [taskId, version]);

  const clientId = review?.clientId ?? null;

  const approveUpdate = useCallback(
    async (comment: string) => {
      await clientAPI.approveClientInfo(taskId, comment);
      toastSuccess("Approved", "The profile update has been approved.");
      setLogsVersion((v) => v + 1);
    },
    [taskId, toastSuccess],
  );

  const rejectUpdate = useCallback(
    async (comment: string) => {
      await clientAPI.rejectClientInfo(taskId, comment);
      toastSuccess("Rejected", "The profile update has been sent back for revision.");
      setLogsVersion((v) => v + 1);
    },
    [taskId, toastSuccess],
  );

  const value = useMemo(
    () => ({
      taskId,
      clientId,
      review,
      isLoading,
      error,
      notFound,
      isReviewer,
      refetch,
      logsVersion,
      approveUpdate,
      rejectUpdate,
    }),
    [taskId, clientId, review, isLoading, error, notFound, isReviewer, refetch, logsVersion, approveUpdate, rejectUpdate],
  );

  return (
    <ProfileUpdateReviewContext.Provider value={value}>
      {children}
    </ProfileUpdateReviewContext.Provider>
  );
}

export function useProfileUpdateReview() {
  const ctx = useContext(ProfileUpdateReviewContext);
  if (!ctx) throw new Error("useProfileUpdateReview must be used within ProfileUpdateReviewProvider");
  return ctx;
}
