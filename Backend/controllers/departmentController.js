import Department from "../models/Department.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate({
      path: "wards.beds.assignedUser", //  populate nested reference
      select: "name email role",       // only bring what you need
    });
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
    const { deptId, wardName, bedId } = req.body;
    const userId = req.user._id;

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find((w) => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    const bed = ward.beds.find((b) => b.id === bedId);
    if (!bed) return res.status(404).json({ message: "Bed not found" });

    // If no assigned user → stop
    if (!bed.assignedUser) {
      return res.status(400).json({ message: "No user assigned to this bed. Can't send notification." });
    }

    // If the clicking user is the assigned one → stop
    if (bed.assignedUser.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot notify yourself." });
    }

    // Get assigned user details
    const assignedUser = await User.findById(bed.assignedUser);

    // Update bed status
    bed.status = "occupied";
    await department.save();

    // Send email notification
    await sendEmail(
      assignedUser.email,
      "Patient Admission Notification",
      `A patient was admitted to Bed ${bed.id}, Ward ${ward.name}, Department ${department.name}.`
    );

    return res.json({ message: `Patient admitted. Notification sent to ${assignedUser.email}` });
  } catch (error) {
    console.error("admitPatient error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Discharge patient
export const dischargePatient = async (req, res) => {
  try {
    const { deptId, wardName, bedId } = req.body;
    const userId = req.user._id;

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find((w) => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    const bed = ward.beds.find((b) => b.id === bedId);
    if (!bed) return res.status(404).json({ message: "Bed not found" });

    // If no assigned user → stop
    if (!bed.assignedUser) {
      return res.status(400).json({ message: "No user assigned to this bed. Can't send notification." });
    }

    // If the clicking user is the assigned one → stop
    if (bed.assignedUser.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot notify yourself." });
    }

    // Get assigned user details
    const assignedUser = await User.findById(bed.assignedUser);

    // Update bed status
    bed.status = "available";
    await department.save();

    // Send email notification
    await sendEmail(
      assignedUser.email,
      "Patient Discharge Notification",
      `Your patient was discharged from Bed ${bed.id}, Ward ${ward.name}, Department ${department.name}.`
    );

    return res.json({ message: `Patient discharged. Notification sent to ${assignedUser.email}` });
  } catch (error) {
    console.error("dischargePatient error:", error);
    res.status(500).json({ error: error.message });
  }
};