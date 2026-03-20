import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../../lib/formatters";
import { PROFILE_REVIEW_TYPE } from "../../../../../types/client-profile";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getRolePrefix } from "../../../../../constants";
import { Pagination } from "../../../../../components/common";
import { useClientProfiles } from "../context/ClientProfilesContext";
import type {
  ClientProfileReviewListItem,
  ProfileReviewType,
  ProfileReviewStatus,
} from "../../../../../types/client-profile";

const HEADERS = [
  { label: "Client", className: "w-[26%] min-w-[180px]" },
  { label: "Type", className: "w-[18%] min-w-[130px]" },
  { label: "Status", className: "w-[16%] min-w-[110px]" },
  { label: "Submitted By", className: "w-[22%] min-w-[150px]" },
  { label: "Submitted", className: "w-[18%] min-w-[110px]" },
];

const typeLabels: Record<ProfileReviewType, string> = {
  ONBOARDING: "Onboarding",
  PROFILE_UPDATE: "Profile Update",
};

const typeStyles: Record<ProfileReviewType, string> = {
  ONBOARDING: "bg-amber-50 text-amber-600 border border-amber-200",
  PROFILE_UPDATE: "bg-violet-50 text-violet-600 border border-violet-200",
};

const typeDotColors: Record<ProfileReviewType, string> = {
  ONBOARDING: "bg-amber-500",
  PROFILE_UPDATE: "bg-violet-500",
};

const statusLabels: Record<ProfileReviewStatus, string> = {
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const statusStyles: Record<ProfileReviewStatus, string> = {
  SUBMITTED: "bg-blue-50 text-blue-600 border border-blue-200",
  APPROVED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  REJECTED: "bg-red-50 text-red-500 border border-red-200",
};

const statusDotColors: Record<ProfileReviewStatus, string> = {
  SUBMITTED: "bg-blue-500",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-red-500",
};

function TypeBadge({ type }: { type: ProfileReviewType }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium flex-shrink-0 whitespace-nowrap ${typeStyles[type]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${typeDotColors[type]}`} />
      {typeLabels[type]}
    </span>
  );
}

function StatusBadge({ status }: { status: ProfileReviewStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium flex-shrink-0 whitespace-nowrap ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotColors[status]}`} />
      {statusLabels[status]}
    </span>
  );
}

const TableHeader = () => (
  <thead>
    <tr className="border-b border-gray-200">
      {HEADERS.map((header) => (
        <th
          key={header.label}
          className={`th-label ${header.className}`}
        >
          {header.label}
        </th>
      ))}
    </tr>
  </thead>
);

function ReviewRow({ review }: { review: ClientProfileReviewListItem }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefix = getRolePrefix(user!.roleKey);

  const handleNavigate = () => {
    if (review.type === PROFILE_REVIEW_TYPE.ONBOARDING) {
      navigate(`${prefix}/client-preview/${review.id}`);
    } else {
      navigate(`${prefix}/profile-update-review/${review.id}`);
    }
  };

  return (
    <tr
      onClick={handleNavigate}
      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
    >
      <td className="px-4 py-4 text-sm font-medium text-primary max-w-0">
        <span className="block truncate" title={review.clientName}>
          {review.clientName}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <TypeBadge type={review.type} />
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <StatusBadge status={review.status} />
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 max-w-0">
        <span className="block truncate" title={review.submittedBy}>
          {review.submittedBy}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
        {formatDate(review.submittedAt)}
      </td>
    </tr>
  );
}

const TableSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-b border-gray-100">
        {Array.from({ length: HEADERS.length }).map((_, j) => (
          <td key={j} className="px-4 py-4">
            <div className="h-4 w-24 rounded skeleton" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const EmptyState = () => (
  <tbody>
    <tr>
      <td
        colSpan={HEADERS.length}
        className="px-4 py-12 text-center text-sm text-gray-500"
      >
        No client profiles found.
      </td>
    </tr>
  </tbody>
);

export default function ClientProfilesTable() {
  const { reviews, isFetching, error, refetch, page, totalPages, totalElements, setPage } = useClientProfiles();

  if (error) {
    return (
      <div className="rounded-lg bg-white custom-shadow p-8 text-center">
        <p className="text-sm text-status-rejected mb-3">{error}</p>
        <button
          onClick={refetch}
          className="text-sm text-accent hover:text-accent-hover font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white custom-shadow">
      <table className="w-full table-fixed">
        <TableHeader />
        {isFetching ? (
          <TableSkeleton />
        ) : reviews.length === 0 ? (
          <EmptyState />
        ) : (
          <tbody>
            {reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </tbody>
        )}
      </table>
      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={20}
        onPageChange={setPage}
      />
    </div>
  );
}
