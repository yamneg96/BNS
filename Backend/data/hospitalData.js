
import hosData from "../../Frontend/src/data/data.js";
import Department from "../models/Department.js";
import connectDB from "../config/db.js"; // your db connection file

const seedHospitalData = async () => {
  try {
    await connectDB(); // use existing connection

    // Clear existing data
    await Department.deleteMany();

    // Insert new data
    await Department.insertMany(hosData.departments);

    console.log("✅ Hospital data seeded!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedHospitalData();
