import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllAssignments,
  getAllDepartments,
  getStats,
  updateData,
  deleteDepartment,
  deleteWard,
  deleteBed,
  addDepartment,
  addWard,
  addBed,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below are protected & admin-only
router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/assignments", getAllAssignments);
router.get("/departments", getAllDepartments);

router.get("/stats", getStats);
router.post("/update", updateData);

// Create endpoints
router.post("/departments", addDepartment);
router.post("/departments/:deptId/wards", addWard);
router.post("/departments/:deptId/wards/:wardId/beds", addBed);


router.delete("/departments/:deptId", deleteDepartment);
router.delete("/departments/:deptId/wards/:wardId", deleteWard);
router.delete("/departments/:deptId/wards/:wardId/beds/:bedId", deleteBed);

export default router;
