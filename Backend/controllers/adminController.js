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

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: "User role updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user and associated data
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all assignments with user and department details
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("user", "name email role")
      .populate("department", "name");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};