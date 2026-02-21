import cron from "node-cron";
import Assignment from "../models/Assignment.js";
import Department from "../models/Department.js";

export const startExpiryJob = () => {
  // Runs every midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running assignment expiry job...");

    try {
      const now = new Date();

      
      const expiredAssignments = await Assignment.find({
        isActive: true,
        $or: [
          { deptExpiry: { $lte: now } },
          { wardExpiry: { $lte: now } },
        ],
      });

      for (const assignment of expiredAssignments) {
        const department = await Department.findById(assignment.department);
        if (!department) continue;

        
        const ward = department.wards.find(
          (w) => w.name === assignment.wardName
        );
        if (!ward) continue;

        
        const room = ward.rooms.find(
          (r) => r.roomNumber === assignment.roomNumber
        );
        if (!room) continue;

        for (const bedNumber of assignment.bedNumbers) {
          const bed = room.beds.find(
            (b) => b.bedNumber === bedNumber
          );

          if (
            bed &&
            bed.assignedUser &&
            String(bed.assignedUser) === String(assignment.user)
          ) {
            bed.assignedUser = null;
            bed.status = "available";
            bed.patient = null;
          }
        }

        await department.save();

        
        assignment.isActive = false;
        await assignment.save();
      }

      console.log(` Expired assignments cleaned: ${expiredAssignments.length}`);
    } catch (err) {
      console.error(" Error in expiry job:", err.message);
    }
  });
};
