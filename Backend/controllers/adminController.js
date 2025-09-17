import User from "../models/User.js";
import Department from "../models/Department.js";
import Assignment from "../models/Assignment.js";


// Get all users (excluding admins)
export const getAllUsers = async (req, res) => {
  try {
    // exclude admins
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password -verifyOtp -resetOtp");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID (excluding sensitive fields)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -verifyOtp -resetOtp");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
