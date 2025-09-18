import express from "express";
import {
  createAssignment,
getAssignmentExpiryForUser
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAssignment);
router.get("/user/:userId/expiry", protect, getAssignmentExpiryForUser);



export default router;