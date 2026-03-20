import apiClient from "./axios-config";
import type {
  NotificationScrollResponse,
  UnreadNotificationsCountResponse,
} from "../types";

const PAGE_SIZE = 15;

export const notificationAPI = {
  getMyNotifications: async (
    page: number = 0,
    unreadOnly: boolean = false,
  ): Promise<NotificationScrollResponse> => {
    const params: Record<string, string | number | boolean> = { page, size: PAGE_SIZE };
    if (unreadOnly) params.unread = true;
    const res = await apiClient.get("/notifications/mine", { params });
    return res.data;
  },

  countUnreadNotifications:
    async (): Promise<UnreadNotificationsCountResponse> => {
      const res = await apiClient.get("/notifications/unread-count");
      return res.data;
    },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/mark-all-read");
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};
