import { Router } from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
} from "../controllers/userController";

import { authenticate } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

const adminRoles = authorize(
  "District Admin",
  "Zone Admin",
  "Regional Admin",
  "System Admin"
);

router.post(
  "/",
  authenticate,
  adminRoles,
  createUser
);

router.get(
  "/",
  authenticate,
  adminRoles,
  getUsers
);

router.get(
  "/:id",
  authenticate,
  adminRoles,
  getUserById
);

router.put(
  "/:id",
  authenticate,
  adminRoles,
  updateUser
);

router.delete(
  "/:id",
  authenticate,
  adminRoles,
  deactivateUser
);

export default router;