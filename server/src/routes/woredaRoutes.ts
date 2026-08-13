import { Router } from "express";

import {
  getWoredas,
  getWoredaById,
  createWoreda,
  updateWoreda,
} from "../controllers/woredaController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getWoredas
);

router.get(
  "/:id",
  authenticate,
  getWoredaById
);

router.post(
  "/",
  authenticate,
  createWoreda
);

router.put(
  "/:id",
  authenticate,
  updateWoreda
);

export default router;