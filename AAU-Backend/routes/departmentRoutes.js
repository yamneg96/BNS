
import express from "express";
import { admitPatient, getBedPatient, getDepartment, getDepartments, recordPatientInBed, } from "../controllers/departmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", getDepartments);
router.get("/:id", getDepartment);
router.get("/:deptId/wards/:wardName/rooms/:roomNumber/beds/:bedNumber/patient", protect, getBedPatient);
//router.get("/department/:deptId/wards/:wardName/beds/:bedId/patient/history", protect, getBedPatientHistory);
router.post("/admit", protect, admitPatient);
router.post("/patient", protect, recordPatientInBed);
//router.post("/discharge", protect, dischargePatient);
//router.put("/update-patient", protect, updatePatientInBed);

export default router;
