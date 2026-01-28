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

/* -------------------- ADMIT PATIENT -------------------- */
export const admitPatient = async (req, res) => {
    try {
        const { deptId, wardName, roomNumber, bedNumber } = req.body;
        const userId = req.user._id;

        const department = await Department.findById(deptId);
        const ward = department?.wards.find(w => w.name === wardName);
        const room = ward?.rooms.find(r => r.roomNumber === roomNumber);
        const bed = room?.beds.find(b => b.bedNumber === bedNumber);

        if (!bed) return res.status(404).json({ message: "Bed not found" });
        if (!bed.assignedUser) {
            return res.status(400).json({ message: "No user assigned to this bed" });
        }
        if (String(bed.assignedUser) === String(userId)) {
            return res.status(400).json({ message: "You cannot notify yourself" });
        }

        const assignedUser = await User.findById(bed.assignedUser);

        bed.status = "occupied";
        await department.save();

        const msg = `Patient admitted to Bed ${bed.bedNumber}, Room ${room.roomNumber}, Ward ${ward.name}`;

        await sendEmail(assignedUser.email, "Patient Admission", msg);

        await Notification.create({
            user: assignedUser._id,
            from: userId,
            type: "admit",
            bedId: bed.bedNumber,
            wardName,
            departmentName: department.name,
            message: msg,
        });

        res.json({ message: "Patient admitted & notification sent" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* -------------------- RECORD PATIENT -------------------- */
export const recordPatientInBed = async (req, res) => {
    try {
        const { deptId, wardName, roomNumber, bedNumber, patient } = req.body;

        const department = await Department.findById(deptId);
        const ward = department?.wards.find(w => w.name === wardName);
        const room = ward?.rooms.find(r => r.roomNumber === roomNumber);
        const bed = room?.beds.find(b => b.bedNumber === bedNumber);

        if (!bed) return res.status(404).json({ message: "Bed not found" });

        bed.patient = { ...patient, admittedAt: new Date() };
        bed.status = "occupied";

        await department.save();

        await PatientHistory.create({
            department: deptId,
            wardName,
            roomNumber,
            bedId: bedNumber,
            patient,
            recordedBy: req.user._id,
        });

        res.status(201).json({ message: "Patient recorded", bed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* -------------------- UPDATE PATIENT -------------------- */
export const updatePatientInBed = async (req, res) => {
    try {
        const { deptId, wardName, roomNumber, bedNumber, patient } = req.body;

        const department = await Department.findById(deptId);
        const ward = department?.wards.find(w => w.name === wardName);
        const room = ward?.rooms.find(r => r.roomNumber === roomNumber);
        const bed = room?.beds.find(b => b.bedNumber === bedNumber);

        if (!bed || !bed.patient) {
            return res.status(404).json({ message: "No patient in this bed" });
        }

        bed.patient = { ...bed.patient, ...patient };
        await department.save();

        await PatientHistory.create({
            department: deptId,
            wardName,
            roomNumber,
            bedId: bedNumber,
            patient: bed.patient,
            recordedBy: req.user._id,
            action: "update",
        });

        res.json({ message: "Patient updated", bed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* -------------------- DISCHARGE PATIENT -------------------- */
export const dischargePatient = async (req, res) => {
    try {
        const { deptId, wardName, roomNumber, bedNumber } = req.body;

        const department = await Department.findById(deptId);
        const ward = department?.wards.find(w => w.name === wardName);
        const room = ward?.rooms.find(r => r.roomNumber === roomNumber);
        const bed = room?.beds.find(b => b.bedNumber === bedNumber);

        if (!bed || !bed.assignedUser) {
            return res.status(400).json({ message: "Invalid discharge" });
        }

        bed.status = "available";
        bed.patient = null;

        await department.save();

        res.json({ message: "Patient discharged" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};