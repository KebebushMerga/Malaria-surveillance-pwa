import { Router } from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, getMyNotifications);

router.put("/:id/read", authenticate, markNotificationAsRead);

router.put("/read-all", authenticate, markAllNotificationsAsRead);

export default router;