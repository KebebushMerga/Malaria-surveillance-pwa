import { Router } from "express";

import {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
} from "../controllers/regionController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getRegions
);

router.get(
  "/:id",
  authenticate,
  getRegionById
);

router.post(
  "/",
  authenticate,
  createRegion
);

router.put(
  "/:id",
  authenticate,
  updateRegion
);

export default router;