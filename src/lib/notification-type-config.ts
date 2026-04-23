import {
  Send,
  Check,
  X,
  ClipboardList,
  ClipboardPlus,
  UserCheck,
  UserX,
  UserMinus,
  ArrowRightLeft,
  MessageSquareText,
} from "lucide-react";
import type { NotificationListItemResponse } from "../types/notification";

export const notificationTypeConfig: Record<
  NotificationListItemResponse["type"],
  { icon: typeof Send; color: string; bg: string }
> = {
  TASK_ASSIGNED: { icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-100" },
  TASK_SUBMITTED: { icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
  TASK_APPROVED: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-100" },
  TASK_REJECTED: { icon: X, color: "text-red-500", bg: "bg-red-100" },
  PROFILE_SUBMITTED: { icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
  PROFILE_APPROVED: { icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
  PROFILE_REJECTED: { icon: UserX, color: "text-red-500", bg: "bg-red-100" },
  CLIENT_HANDOFF: { icon: ArrowRightLeft, color: "text-amber-600", bg: "bg-amber-100" },
  OFFBOARDING_ASSIGNED: { icon: UserMinus, color: "text-amber-600", bg: "bg-amber-100" },
  CONSULTATION_SUBMITTED: { icon: MessageSquareText, color: "text-blue-600", bg: "bg-blue-100" },
  CONSULTATION_APPROVED: { icon: MessageSquareText, color: "text-emerald-600", bg: "bg-emerald-100" },
  CONSULTATION_REJECTED: { icon: MessageSquareText, color: "text-red-500", bg: "bg-red-100" },
  TAX_RECORD_TASK_REQUEST_SUBMITTED: { icon: ClipboardPlus, color: "text-blue-600", bg: "bg-blue-100" },
  TAX_RECORD_TASK_REQUEST_APPROVED: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-100" },
  TAX_RECORD_TASK_REQUEST_REJECTED: { icon: X, color: "text-red-500", bg: "bg-red-100" },
};
