import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getNotificationsForUser } from "../controllers/notifyController.js";

const router = express.Router();

router.get("/", protect, getNotificationsForUser);

export default router;
