import { Request, Response } from "express";
import Notification from "../models/Notification";

export const getMyNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.userId;

    const notifications = await Notification.find({
      recipient: userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const markNotificationAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification as read error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.userId;

    await Notification.updateMany(
      {
        recipient: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications as read error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};
