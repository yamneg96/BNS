import express from "express";
import { registerUser, loginUser, getProfile, verifyUserOtp, resendOtp } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/verify-otp", verifyUserOtp);
router.get("/profile", protect, getProfile);
router.post("/resend-otp", resendOtp);


// Example RBAC: only admins can list all users
import User from "../models/User.js";
router.get("/all", protect, authorizeRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;
