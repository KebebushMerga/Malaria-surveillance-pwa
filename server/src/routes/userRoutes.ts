import { Router } from "express";
import { createUser } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(
    "District Admin",
    "Zone Admin",
    "Regional Admin",
    "System Admin"
  ),
  createUser
);

export default router;