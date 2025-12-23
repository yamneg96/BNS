// routes/departmentRoutes.js
import express from "express";
import {
  getDepartments,
  getDepartment,
  admitPatient,
  dischargePatient,
  recordPatientInBed,
  getBedPatient,
} from "../controllers/departmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", getDepartments);
router.get("/:id", getDepartment);
router.get("/department/:deptId/wards/:wardName/beds/:bedId/patient", protect, getBedPatient);
router.post("/admit", protect, admitPatient);
router.post("/patient", protect, recordPatientInBed);
router.post("/discharge", protect, dischargePatient);

export default router;
