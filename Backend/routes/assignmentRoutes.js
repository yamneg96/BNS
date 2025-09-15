import express from "express";
import {
  createAssignment,
  getAssignmentsForUser,
  getActiveAssignmentsForUser,
  deleteAssignment
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAssignment);
router.get("/user/:userId", protect, getAssignmentsForUser);
router.get("/user/:userId/active", protect, getActiveAssignmentsForUser);
router.delete("/:id", protect, deleteAssignment);


export default router;