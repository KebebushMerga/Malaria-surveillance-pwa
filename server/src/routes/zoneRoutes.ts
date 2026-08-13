import { Router } from "express";

import {
  getZones,
  getZoneById,
  createZone,
  updateZone,
} from "../controllers/zoneController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getZones
);

router.get(
  "/:id",
  authenticate,
  getZoneById
);

router.post(
  "/",
  authenticate,
  createZone
);

router.put(
  "/:id",
  authenticate,
  updateZone
);

export default router;