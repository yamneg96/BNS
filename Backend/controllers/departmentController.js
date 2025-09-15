import Department from "../models/Department.js";
import User from "../models/User.js";

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single department
export const getDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admit patient
export const admitPatient = async (req, res) => {
  try {
    const { deptId, wardName, bedId, userId } = req.body;

    // check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find(w => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    const bed = ward.beds.find(b => b.id === bedId);
    if (!bed) return res.status(404).json({ message: "Bed not found" });

    if (bed.status === "occupied") {
      return res.status(400).json({ message: "Bed already occupied" });
    }

    bed.status = "occupied";
    bed.assignedUser = user._id; // 👈 store reference

    await department.save();

    res.json({ message: "Patient admitted", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};