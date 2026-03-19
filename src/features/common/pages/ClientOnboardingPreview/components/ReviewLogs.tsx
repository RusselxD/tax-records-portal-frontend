import { ActivityLogs } from "../../../components/client-info";
import { useInfoReview } from "../context/ClientOnboardingPreviewContext";

export default function ReviewLogs() {
  const { taskId } = useInfoReview();
  return <ActivityLogs taskId={taskId} />;
}
