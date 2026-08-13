import { Router } from "express";
import {
  getHealthFacilities,
  getHealthFacilityById,
  createHealthFacility,
  updateHealthFacility,
  deleteHealthFacility,
} from "../controllers/healthFacilityController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getHealthFacilities
);

router.get(
  "/:id",
  authenticate,
  getHealthFacilityById
);

router.post(
  "/",
  authenticate,
  createHealthFacility
);

router.put(
  "/:id",
  authenticate,
  updateHealthFacility
);

router.delete(
  "/:id",
  authenticate,
  deleteHealthFacility
);
export default router;