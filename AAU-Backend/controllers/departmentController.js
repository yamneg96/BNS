import Department from "../models/Department.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import Notification from "../models/Notification.js";
import PatientHistory from "../models/PatientHistory.js";

/* -------------------- GET ALL DEPARTMENTS -------------------- */
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate({
            path: "wards.rooms.beds.assignedUser",
            select: "name email role",
        });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};