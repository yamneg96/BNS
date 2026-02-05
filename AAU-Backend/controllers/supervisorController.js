import Department from "../models/Department.js";
import User from "../models/User.js";

/* ================= USERS ================= */

// Get all users (exclude admins)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } })
            .select("-password -verifyOtp -resetOtp");

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
