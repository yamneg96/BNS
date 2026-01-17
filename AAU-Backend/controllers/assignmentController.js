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

export const addBedsToAssignment = async (req, res) => {
  const { id } = req.params;
  const { bedNumbers } = req.body;

  const assignment = await Assignment.findById(id);
  if (!assignment) return res.status(404).json({ message: "Assignment not found" });

  const department = await Department.findById(assignment.department);
  const ward = department.wards.find(w => w.name === assignment.wardName);
  const room = ward.rooms.find(r => r.roomNumber === assignment.roomNumber);

  for (const bn of bedNumbers) {
    const bed = room.beds.find(b => b.bedNumber === bn);
    if (!bed) return res.status(404).json({ message: `Bed ${bn} not found` });

    if (bed.assignedUser && String(bed.assignedUser) !== String(assignment.user)) {
      return res.status(409).json({ message: `Bed ${bn} already assigned` });
    }

    bed.assignedUser = assignment.user;
    bed.status = "occupied";

    if (!assignment.bedNumbers.includes(bn)) {
      assignment.bedNumbers.push(bn);
    }
  }

  await department.save();
  await assignment.save();

  res.json({ message: "Beds added", assignment });
};


export const removeBedsFromAssignment = async (req, res) => {
  const { id } = req.params;
  const { bedNumbers } = req.body;

  const assignment = await Assignment.findById(id);
  const department = await Department.findById(assignment.department);

  const ward = department.wards.find(w => w.name === assignment.wardName);
  const room = ward.rooms.find(r => r.roomNumber === assignment.roomNumber);

  for (const bn of bedNumbers) {
    const bed = room.beds.find(b => b.bedNumber === bn);
    if (bed && String(bed.assignedUser) === String(assignment.user)) {
      bed.assignedUser = null;
      bed.status = "available";
    }
  }

  assignment.bedNumbers = assignment.bedNumbers.filter(
    b => !bedNumbers.includes(b)
  );

  await department.save();

  if (!assignment.bedNumbers.length) {
    await assignment.deleteOne();
    return res.json({ message: "Assignment removed (no beds left)" });
  }

  await assignment.save();
  res.json({ message: "Beds removed", assignment });
};

export const getAssignmentExpiryForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const latestAssignment = await Assignment.findOne({
      user: userId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .select("deptExpiry wardExpiry roomNumber wardName");

    if (!latestAssignment) {
      return res.json(null);
    }

    res.json({
      ward: latestAssignment.wardName,
      room: latestAssignment.roomNumber,
      deptExpiry: latestAssignment.deptExpiry,
      wardExpiry: latestAssignment.wardExpiry,
    });
  } catch (err) {
    console.error("getAssignmentExpiryForUser error:", err);
    res.status(500).json({ message: err.message });
  }
};


