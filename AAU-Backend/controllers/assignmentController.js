import mongoose from "mongoose";
import Department from "../models/Department.js";
import User from "../models/User.js";
import Assignment from "../models/Assignment.js";


const areSameBeds = (a = [], b = []) => {
  if (a.length !== b.length) return false;
  return a.map(Number).sort().join(",") === b.map(Number).sort().join(",");
};

export const createAssignment = async (req, res) => {
  try {
    const {
      deptId,
      wardName,
      roomNumber,
      bedNumbers,
      deptExpiry,
      wardExpiry,
      note,
    } = req.body;

    const userId = req.user?._id;

    if (!deptId || !wardName || !roomNumber || !Array.isArray(bedNumbers) || !bedNumbers.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find(w => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    const room = ward.rooms.find(r => r.roomNumber === roomNumber);
    if (!room) return res.status(404).json({ message: "Room not found" });

    
    for (const bn of bedNumbers) {
      const bed = room.beds.find(b => b.bedNumber === bn);
      if (!bed) {
        return res.status(404).json({ message: `Bed ${bn} not found in room ${roomNumber}` });
      }
      if (bed.assignedUser) {
        return res.status(409).json({ message: `Bed ${bn} already assigned` });
      }
    }

   
    const existing = await Assignment.find({
      user: userId,
      department: deptId,
      wardName,
      roomNumber,
      isActive: true,
    });

    for (const a of existing) {
      if (areSameBeds(a.bedNumbers, bedNumbers)) {
        return res.status(409).json({ message: "Duplicate assignment exists" });
      }
    }

   
    for (const bn of bedNumbers) {
      const bed = room.beds.find(b => b.bedNumber === bn);
      bed.assignedUser = userId;
      bed.status = "occupied";
    }

    await department.save();

    const assignment = await Assignment.create({
      user: userId,
      department: deptId,
      wardName,
      roomNumber,
      bedNumbers,
      deptExpiry,
      wardExpiry,
      note,
      createdBy: userId,
    });

    res.json({ message: "Assignment created", assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyAssignments = async (req, res) => {
  try {
    const userId = req.user._id;

    const assignments = await Assignment.find({ user: userId, isActive: true })
      .populate("department", "name wards")
      .populate("createdBy", "name email role");

    const result = assignments.map(a => {
      const ward = a.department.wards.find(w => w.name === a.wardName);
      const room = ward?.rooms.find(r => r.roomNumber === a.roomNumber);
      const beds = room
        ? room.beds.filter(b => a.bedNumbers.includes(b.bedNumber))
        : [];

      return {
        _id: a._id,
        department: a.department.name,
        ward: a.wardName,
        room: a.roomNumber,
        beds,
        deptExpiry: a.deptExpiry,
        wardExpiry: a.wardExpiry,
        note: a.note,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

