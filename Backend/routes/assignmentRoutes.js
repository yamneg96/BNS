import express from "express";
import {
  createAssignment,
getAssignmentExpiryForUser,
updateAssignment
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAssignment);
router.get("/user/:userId/expiry", protect, getAssignmentExpiryForUser);
router.put("/:id", protect, updateAssignment);



export default router;