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

/* ================= DEPARTMENTS ================= */

// Get all departments → wards → rooms → beds
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
            .populate({
                path: "wards.rooms.beds.assignedUser",
                select: "name email role image",
            });

        res.status(200).json(departments);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching departments",
            error: err.message,
        });
    }
};

// Add department
export const addDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ message: "Department name is required" });

        const department = new Department({ name, wards: [] });
        await department.save();

        res.status(201).json({ message: "Department created", department });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete department
export const deleteDepartment = async (req, res) => {
    try {
        const { deptId } = req.params;

        const department = await Department.findByIdAndDelete(deptId);
        if (!department)
            return res.status(404).json({ message: "Department not found" });

        res.json({ message: "Department deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ================= WARDS ================= */

// Add ward
export const addWard = async (req, res) => {
    try {
        const { deptId } = req.params;
        const { name } = req.body;

        const department = await Department.findById(deptId);
        if (!department)
            return res.status(404).json({ message: "Department not found" });

        department.wards.push({ name, rooms: [] });
        await department.save();

        res.status(201).json({ message: "Ward added", department });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete ward
export const deleteWard = async (req, res) => {
    try {
        const { deptId, wardId } = req.params;

        const department = await Department.findById(deptId);
        if (!department)
            return res.status(404).json({ message: "Department not found" });

        const ward = department.wards.id(wardId);
        if (!ward)
            return res.status(404).json({ message: "Ward not found" });

        ward.remove();
        await department.save();

        res.json({ message: "Ward deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ================= ROOMS ================= */

// Add room
export const addRoom = async (req, res) => {
    try {
        const { deptId, wardId } = req.params;
        const { roomNumber } = req.body;

        const department = await Department.findById(deptId);
        if (!department)
            return res.status(404).json({ message: "Department not found" });

        const ward = department.wards.id(wardId);
        if (!ward)
            return res.status(404).json({ message: "Ward not found" });

        ward.rooms.push({ roomNumber, beds: [] });
        await department.save();

        res.status(201).json({ message: "Room added", ward });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete room
export const deleteRoom = async (req, res) => {
    try {
        const { deptId, wardId, roomId } = req.params;

        const department = await Department.findById(deptId);
        if (!department)
            return res.status(404).json({ message: "Department not found" });

        const ward = department.wards.id(wardId);
        if (!ward)
            return res.status(404).json({ message: "Ward not found" });

        const room = ward.rooms.id(roomId);
        if (!room)
            return res.status(404).json({ message: "Room not found" });

        room.remove();
        await department.save();

        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ================= BEDS ================= */

// Add bed
export const addBed = async (req, res) => {
    try {
        const { deptId, wardId, roomId } = req.params;
        const { bedNumber } = req.body;

        const department = await Department.findById(deptId);
        if (!department)
            return res.status(404).json({ message: "Department not found" });

        const ward = department.wards.id(wardId);
        if (!ward)
            return res.status(404).json({ message: "Ward not found" });

        const room = ward.rooms.id(roomId);
        if (!room)
            return res.status(404).json({ message: "Room not found" });

        room.beds.push({
            bedNumber,
            status: "available",
            assignedUser: null,
            patient: null,
        });

        await department.save();

        res.status(201).json({ message: "Bed added", room });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete bed
export const deleteBed = async (req, res) => {
    try {
        const { deptId, wardId, roomId, bedId } = req.params;

        const department = await Department.findById(deptId);
        if (!department)
            return res.status(404).json({ message: "Department not found" });

        const ward = department.wards.id(wardId);
        if (!ward)
            return res.status(404).json({ message: "Ward not found" });

        const room = ward.rooms.id(roomId);
        if (!room)
            return res.status(404).json({ message: "Room not found" });

        const bed = room.beds.id(bedId);
        if (!bed)
            return res.status(404).json({ message: "Bed not found" });

        bed.remove();
        await department.save();

        res.json({ message: "Bed deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
