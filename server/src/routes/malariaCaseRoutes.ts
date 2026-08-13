import { Router } from "express";

import {
  getMalariaCases,
  getMalariaCaseById,
  createMalariaCase,
  updateMalariaCase,
  deleteMalariaCase,
} from "../controllers/malariaCaseController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, getMalariaCases);

router.get("/:id", authenticate, getMalariaCaseById);

router.post("/", authenticate, createMalariaCase);

router.put("/:id", authenticate, updateMalariaCase);

router.delete("/:id", authenticate, deleteMalariaCase);

export default router;