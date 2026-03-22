import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, AlertTriangle, Clock, Pencil, CheckCircle2 } from "lucide-react";
import usePageTitle from "../../../../hooks/usePageTitle";
import { Button } from "../../../../components/common";
import NotFound from "../../../../pages/NotFound";
import { useAuth } from "../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../constants/roles";
import { PROFILE_REVIEW_STATUS } from "../../../../types/client-profile";
import { ActivityLogs } from "../../components/client-info";
import {
  ProfileUpdateReviewProvider,
  useProfileUpdateReview,
} from "./context/ProfileUpdateReviewContext";
import SectionDiffCard from "./components/SectionDiffCard";
import ReviewActions from "./components/ReviewActions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ProfileUpdateReviewContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefix = getRolePrefix(user?.roleKey ?? "");
  const {
    taskId,
    clientId,
    review,
    isLoading,
    error,
    notFound,
    isReviewer,
    refetch,
    logsVersion,
  } = useProfileUpdateReview();



  if (notFound) return <NotFound inline />;

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <div className="h-4 w-48 rounded skeleton mb-2" />
        <div className="h-8 w-72 rounded skeleton mb-8" />
        <div className="flex gap-2 items-start">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="rounded-lg bg-white p-5 space-y-3" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
              <div className="h-4 w-64 rounded skeleton" />
              <div className="h-3 w-48 rounded skeleton" />
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white p-5 space-y-3" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                <div className="h-4 w-40 rounded skeleton" />
                <div className="h-10 w-full rounded skeleton" />
                <div className="h-10 w-full rounded skeleton" />
              </div>
            ))}
          </div>
          <div className="w-[21rem] flex-shrink-0 hidden lg:block">
            <div className="rounded-lg bg-white p-5 space-y-3" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
              <div className="h-4 w-32 rounded skeleton" />
              <div className="h-3 w-full rounded skeleton" />
              <div className="h-3 w-3/4 rounded skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertTriangle className="h-8 w-8 text-gray-300 mb-3" />
          <p className="text-sm text-status-rejected mb-3">{error}</p>
          <Button variant="secondary" onClick={refetch}>Try again</Button>
        </div>
      </div>
    );
  }

  if (!review) return null;

  return (
    <div className="max-w-[1440px] mx-auto pb-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
          <button onClick={() => navigate(`/${prefix}/clients`)} className="hover:text-accent transition-colors">
            Client List
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <button onClick={() => navigate(`/${prefix}/client-details/${clientId}`)} className="hover:text-accent transition-colors">
            {review.clientName}
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-600">Profile Update Review</span>
        </div>
        <h1 className="text-2xl font-bold text-primary">Profile Update Review</h1>
      </div>

      <div className="flex gap-2 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Submission info */}
          <div className="rounded-lg bg-white border border-gray-200 p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Submitted by <span className="font-medium text-primary">{review.submittedBy.name}</span></span>
              <span className="text-gray-300">·</span>
              <span>{formatDate(review.submittedAt)}</span>
            </div>
            {review.comment && (
              <p className="text-sm text-gray-600 mt-2 pl-5.5">
                "{review.comment}"
              </p>
            )}
          </div>

          {/* Approved banner */}
          {review.status === PROFILE_REVIEW_STATUS.APPROVED && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">This profile update has been approved.</p>
                  <p className="text-sm text-green-700 mt-1">The changes have been applied to the client's live profile.</p>
                  <button
                    onClick={() => navigate(`/${prefix}/client-details/${clientId}`)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white border border-green-200 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                  >
                    View Client Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rejection banner */}
          {review.status === PROFILE_REVIEW_STATUS.REJECTED && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-medium text-red-700 mb-1">This profile update was rejected.</p>
              <p className="text-sm text-red-600 mb-4">Check the activity logs for details. You can revise and resubmit.</p>
              <button
                onClick={() => navigate(`/${prefix}/client-edit/${review.clientId}`)}
                className="inline-flex items-center gap-1.5 rounded-md bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Revise &amp; Resubmit
              </button>
            </div>
          )}

          {/* Changed sections */}
          {review.sections.length === 0 ? (
            <div className="rounded-lg bg-white border border-gray-200 p-8 text-center" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
              <p className="text-sm text-gray-400">No differences found.</p>
            </div>
          ) : (
            review.sections.map((section) => (
              <SectionDiffCard key={section.sectionKey} section={section} />
            ))
          )}

          {/* Review actions */}
          {isReviewer && review.status === PROFILE_REVIEW_STATUS.SUBMITTED && <ReviewActions />}
        </div>

        {/* Sidebar */}
        <div className="w-[21rem] flex-shrink-0 hidden lg:block sticky top-6 self-start space-y-3">
          <ActivityLogs taskId={taskId} refetchSignal={logsVersion} />
        </div>
      </div>
    </div>
  );
}

export default function ProfileUpdateReview() {
  const { id } = useParams<{ id: string }>();
  usePageTitle("Profile Update Review");

  if (!id) return null;

  return (
    <ProfileUpdateReviewProvider taskId={id}>
      <ProfileUpdateReviewContent />
    </ProfileUpdateReviewProvider>
  );
}
