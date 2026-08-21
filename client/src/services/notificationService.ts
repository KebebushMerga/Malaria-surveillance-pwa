import apiClient from "../api/apiClient";

export type NotificationType =
  | "Outbreak Alert"
  | "System Alert"
  | "Information";

export interface Notification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async () => {
  const response =
    await apiClient.get<{
      count: number;
      notifications: Notification[];
    }>("/notifications");

  return response.data;
};

export const markNotificationAsRead =
  async (id: string) => {
    const response =
      await apiClient.patch<{
        message: string;
        notification: Notification;
      }>(`/notifications/${id}/read`);

    return response.data;
  };