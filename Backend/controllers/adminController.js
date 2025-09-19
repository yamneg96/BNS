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

// Get system statistics
export const getStats = async (req, res) => {
  try {
    // total users
    const totalUsers = await User.countDocuments();

    // count users by role
    const rolesCount = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    // total departments
    const totalDepartments = await Department.countDocuments();

    // count occupied vs available beds
    const departments = await Department.find();
    let totalBeds = 0;
    let occupiedBeds = 0;
    let availableBeds = 0;

    departments.forEach((dept) => {
      dept.wards.forEach((ward) => {
        ward.beds.forEach((bed) => {
          totalBeds++;
          if (bed.status === "occupied") occupiedBeds++;
          else availableBeds++;
        });
      });
    });

    res.json({
      totalUsers,
      rolesCount,
      totalDepartments,
      beds: {
        total: totalBeds,
        occupied: occupiedBeds,
        available: availableBeds,
      },
    });
  } catch (error) {
    console.error("getStats error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update data based on type (user role or department details)
export const updateData = async (req, res) => {
  try {
    const { type, payload } = req.body;

    if (type === "userRole") {
      const { userId, newRole } = payload;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.role = newRole;
      await user.save();
      return res.json({ message: "User role updated successfully", user });
    }

    if (type === "department") {
      const { deptId, updateFields } = payload;
      const dept = await Department.findByIdAndUpdate(deptId, updateFields, {
        new: true,
      });
      if (!dept) return res.status(404).json({ message: "Department not found" });
      return res.json({ message: "Department updated successfully", dept });
    }

    return res.status(400).json({ message: "Invalid update type" });
  } catch (error) {
    console.error("updateData error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;
    const department = await Department.findByIdAndDelete(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("deleteDepartment error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a ward from a department
export const deleteWard = async (req, res) => {
  try {
    const { deptId, wardId } = req.params;

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    // find ward index
    const wardIndex = department.wards.findIndex(
      (ward) => ward._id.toString() === wardId
    );
    if (wardIndex === -1) return res.status(404).json({ message: "Ward not found" });

    // remove ward
    department.wards.splice(wardIndex, 1);
    await department.save();

    res.json({ message: "Ward deleted successfully", department });
  } catch (error) {
    console.error("deleteWard error:", error);
    res.status(500).json({ error: error.message });
  }
};


// Delete a bed from a ward
export const deleteBed = async (req, res) => {
  try {
    const { deptId, wardId, bedId } = req.params;

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.id(wardId);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    const bedIndex = ward.beds.findIndex(
      (bed) => bed._id.toString() === bedId
    );
    if (bedIndex === -1) return res.status(404).json({ message: "Bed not found" });

    // remove bed
    ward.beds.splice(bedIndex, 1);
    await department.save();

    res.json({ message: "Bed deleted successfully", ward });
  } catch (error) {
    console.error("deleteBed error:", error);
    res.status(500).json({ error: error.message });
  }
};