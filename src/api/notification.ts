import apiClient from "./axios-config";
import type {
  NotificationScrollResponse,
  UnreadNotificationsCountResponse,
} from "../types";

const PAGE_SIZE = 15;

export const notificationAPI = {
  getMyNotifications: async (page: number = 0): Promise<NotificationScrollResponse> => {
    const res = await apiClient.get("/notifications/mine", {
      params: { page, size: PAGE_SIZE },
    });
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
};
