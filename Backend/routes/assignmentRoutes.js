import express from "express";
import {
  createAssignment,
getAssignmentExpiryForUser,
getMyAssignments,
updateAssignment
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAssignment);
router.get("/user/:userId/expiry", protect, getAssignmentExpiryForUser);
// Protected route: any logged-in user can view their assignments
router.get("/my", protect, getMyAssignments);
router.put("/:id", protect, updateAssignment);



export default router;