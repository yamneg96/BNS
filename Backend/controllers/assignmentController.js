import Department from "../models/Department.js";
import User from "../models/User.js";
import Assignment from "../models/Assignment.js";

/**
 * Create assignment:
 * body: { userId, deptId, wardName, beds: [bedId], deptExpiry, wardExpiry, note }
 * - Validate user / department / ward
 * - Validate beds are available
 * - Mark beds as occupied and assignedUser = userId
 * - Save Department and create Assignment doc
 */
export const createAssignment = async (req, res) => {
  try {
    const {
      deptId,
      wardName,
      beds: bedIds,
      deptExpiry,
      wardExpiry,
      note,
    } = req.body;

    const user = req.user; // from JWT

    // Basic validations
    if (!deptId || !wardName || !Array.isArray(bedIds) || bedIds.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find(w => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    // Check bed existence & availability
    const unavailableBeds = [];
    for (const bedId of bedIds) {
      const bed = ward.beds.find(b => b.id === bedId);
      if (!bed) return res.status(404).json({ message: `Bed ${bedId} not found in ward ${wardName}` });
      if (bed.status === "occupied") unavailableBeds.push(bedId);
    }
    if (unavailableBeds.length) {
      return res.status(400).json({ message: `Beds already occupied: ${unavailableBeds.join(", ")}` });
    }

    // ✅ Mark beds as occupied and assign to this user
    for (const bedId of bedIds) {
      const bed = ward.beds.find(b => b.id === bedId);
      bed.status = "occupied";
      bed.assignedUser = user._id;
    }

    await department.save();

    // ✅ Create Assignment doc
    const assignment = new Assignment({
      user: user._id,                  // logged-in user only
      department: department._id,
      ward: ward.name,
      beds: bedIds,
      deptExpiry: new Date(deptExpiry),
      wardExpiry: new Date(wardExpiry),
      note: note || "",
      createdBy: user._id,
    });

    await assignment.save();

    return res.json({ message: "Assignment created", assignment });
  } catch (err) {
    console.error("createAssignment error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};


/**
 * Get assignments for a user
 */
export const getAssignmentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const assignments = await Assignment.find({ user: userId })
      .populate("department", "name")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.json(assignments);
  } catch (err) {
    console.error("getAssignmentsForUser error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Get active assignment(s) for a user (deptExpiry or wardExpiry in future)
 */
export const getActiveAssignmentsForUser = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware
    const now = new Date();

    const assignments = await Assignment.find({
      user: userId,
      $or: [
        { deptExpiry: { $gte: now } },
        { wardExpiry: { $gte: now } }
      ]
    }).populate("department", "name");

    return res.json(assignments);
  } catch (err) {
    console.error("getActiveAssignmentsForUser error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Delete assignment (optional) and free beds
 */
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // find department and free up beds
    const department = await Department.findById(assignment.department);
    if (department) {
      const ward = department.wards.find(w => w.name === assignment.ward);
      if (ward) {
        for (const bedId of assignment.beds) {
          const bed = ward.beds.find(b => b.id === bedId);
          if (bed) {
            bed.status = "available";
            bed.assignedUser = null;
          }
        }
        await department.save();
      }
    }

    await assignment.remove();

    return res.json({ message: "Assignment deleted and beds freed" });
  } catch (err) {
    console.error("deleteAssignment error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
