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

/* -------------------- GET SINGLE DEPARTMENT -------------------- */
export const getDepartment = async (req, res) => {
    try {
        const dept = await Department.findById(req.params.id);
        if (!dept) return res.status(404).json({ message: "Department not found" });
        res.json(dept);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/* -------------------- GET PATIENT IN BED -------------------- */
export const getBedPatient = async (req, res) => {
    const { deptId, wardName, roomNumber, bedNumber } = req.params;

    const department = await Department.findById(deptId);
    const ward = department?.wards.find(w => w.name === wardName);
    const room = ward?.rooms.find(r => r.roomNumber === roomNumber);
    const bed = room?.beds.find(b => b.bedNumber === Number(bedNumber));

    if (!bed) return res.status(404).json({ message: "Bed not found" });

    res.json({ bedNumber: bed.bedNumber, patient: bed.patient });
};
