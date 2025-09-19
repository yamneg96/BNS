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

    const userFromToken = req.user; // from JWT (may be plain object with id/_id)
    const userId = userFromToken?._id || userFromToken?.id;

    // Basic validations
    if (!deptId || !wardName || !Array.isArray(bedIds) || bedIds.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find(w => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    // Validate that each bedId exists in the ward (BUT do NOT reject occupied beds)
    for (const bedId of bedIds) {
      const bed = ward.beds.find(b => String(b.id) === String(bedId));
      if (!bed) {
        return res.status(404).json({ message: `Bed ${bedId} not found in ward ${wardName}` });
      }
      // Note: we intentionally do NOT check bed.status === "occupied" here,
      // because doctors/users should be able to be assigned regardless.
    }

    // Assign beds to this user (set assignedUser). We intentionally do NOT change bed.status.
    for (const bedId of bedIds) {
      const bed = ward.beds.find(b => String(b.id) === String(bedId));
      bed.assignedUser = userId;
    }

    // Save the updated department (with assignedUser changes)
    await department.save();

    // Create Assignment doc
    const assignment = new Assignment({
      user: userId,
      department: department._id,
      ward: ward.name,
      beds: bedIds,
      deptExpiry: deptExpiry ? new Date(deptExpiry) : null,
      wardExpiry: wardExpiry ? new Date(wardExpiry) : null,
      note: note || "",
      createdBy: userId,
    });

    await assignment.save();

    // Mark firstLoginDone on the real user document (only if not already true)
    const userDoc = await User.findById(userId);
    if (userDoc && !userDoc.firstLoginDone) {
      userDoc.firstLoginDone = true;
      await userDoc.save();
    }

    // Return assignment and updated user to frontend (so frontend can refresh context)
    const updatedUser = await User.findById(userId).select("-password");
    return res.json({ message: "Assignment created", assignment, user: updatedUser });
  } catch (err) {
    console.error("createAssignment error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};


/**
 * Get latest assignment expiry dates for the logged-in user
 */
export const getAssignmentExpiryForUser = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT/protect middleware

    const latestAssignment = await Assignment.findOne({ user: userId })
      .sort({ createdAt: -1 }) // latest one
      .select("deptExpiry wardExpiry"); // only return expiry fields

    if (!latestAssignment) {
      return res.json(null); // no assignments yet
    }

    return res.json({
      deptExpiry: latestAssignment.deptExpiry,
      wardExpiry: latestAssignment.wardExpiry,
    });
  } catch (err) {
    console.error("getAssignmentExpiryForUser error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};


// Get logged-in user's assignments
export const getMyAssignments = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    // populate department details
    const assignments = await Assignment.find({ user: userId })
      .populate("department", "name wards")
      .populate("createdBy", "name email role");

    if (!assignments.length) {
      return res.status(404).json({ message: "No assignments found" });
    }

    // format response with dept, ward, and bed details
    const formattedAssignments = assignments.map((a) => {
      const dept = a.department;

      // find the ward
      const ward = dept.wards.find((w) => w.name === a.ward);

      // get bed objects for the assigned bed ids
      const assignedBeds = ward
        ? ward.beds.filter((b) => a.beds.includes(b.id))
        : [];

      return {
        _id: a._id,
        department: dept.name,
        ward: a.ward,
        beds: assignedBeds,
        deptExpiry: a.deptExpiry,
        wardExpiry: a.wardExpiry,
        note: a.note,
        createdBy: a.createdBy,
        createdAt: a.createdAt,
      };
    });

    res.json(formattedAssignments);
  } catch (error) {
    console.error("getMyAssignments error:", error);
    res.status(500).json({ error: error.message });
  }
};