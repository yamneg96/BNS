// routes/departmentRoutes.js
import express from "express";
import {
  getDepartments,
  getDepartment,
  admitPatient,
  dischargePatient,
} from "../controllers/departmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all departments
router.get("/", getDepartments);

// GET single department by ID
router.get("/:id", getDepartment);

// POST admit a patient to a bed
router.post("/admit", protect, admitPatient);

// POST discharge a patient from a bed
router.post("/discharge", protect, dischargePatient);

export default router;
