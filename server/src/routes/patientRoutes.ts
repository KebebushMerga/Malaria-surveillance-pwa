import { Router } from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, getPatients);

router.get("/:id", authenticate, getPatientById);

router.post("/", authenticate, createPatient);

router.put("/:id", authenticate, updatePatient);

router.delete("/:id", authenticate, deletePatient);

export default router;