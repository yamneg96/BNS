import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getNotificationsForUser, } from "../controllers/notifyController.js";

const router = express.Router();


router.get("/", protect, getNotificationsForUser);

//router.get("/unread/count", protect, getUnreadNotificationCount);

//router.put("/:id/read", protect, markAsRead);


//router.put("/read-all", protect, markAllAsRead);

export default router;
