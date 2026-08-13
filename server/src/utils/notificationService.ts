import Notification, {
  NotificationType,
} from "../models/Notification";

interface CreateNotificationParams {
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
}

export const createNotification = async ({
  recipient,
  type,
  title,
  message,
}: CreateNotificationParams): Promise<void> => {
  try {
    await Notification.create({
      recipient,
      type,
      title,
      message,
      isRead: false,
    });
  } catch (error) {
    console.error("Notification creation failed:", error);
  }
};