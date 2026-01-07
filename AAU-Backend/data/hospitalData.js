import "dotenv/config";
import Department from "../models/Department.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

/* -------------------- Department Template -------------------- */
const departmentsTemplate = [
  {
    name: "Internal Medicine",
    wards: ["Ward C", "Ward D", "Inpatient", "Stroke", "Kalazar"],
  },
  {
    name: "GynObs",
    wards: [
      "Labor",
      "M1 up",
      "M1 down",
      "M2 (post natal)",
      "M3 (high risk)",
      "Gyn ward",
      "Michu",
      "Fistula",
    ],
  },
  {
    name: "Pediatrics",
    wards: [
      "ETAT",
      "Emergency",
      "Main ward (under 5 and above 5)",
      "Nutrition and infant",
      "Hemato Oncology",
      "NICU",
    ],
  },
  {
    name: "Surgery",
    wards: ["Trauma EOPD", "Non trauma EOPD", "Recovery", "Surgical ward", "Ortho ward"],
  },
  {
    name: "Emergency",
    wards: ["Red", "Orange", "Yellow"],
  },
  { name: "Dermatology", wards: ["Dermatology"] },
  { name: "Psychiatry", wards: ["Psychiatry"] },
  { name: "ENT", wards: ["ENT"] },
  { name: "Ophthalmology", wards: ["Ophthalmology"] },
];

/* -------------------- Helpers -------------------- */

// Generate beds per room
const generateBeds = (bedsPerRoom = 30) => {
  return Array.from({ length: bedsPerRoom }, (_, i) => ({
    bedNumber: i + 1,
    status: Math.random() < 0.5 ? "occupied" : "available",
    assignedUser: null,
    patient: null,
  }));
};

// Generate rooms per ward
const generateRooms = (roomsPerWard = 10) => {
  return Array.from({ length: roomsPerWard }, (_, i) => ({
    roomNumber: `R-${i + 1}`,
    beds: generateBeds(),
  }));
};

/* -------------------- Seeder -------------------- */
const seedHospitalData = async () => {
  try {
    await connectDB();
    await User.find(); // users fetched if needed later

    await Department.deleteMany();

    const departments = departmentsTemplate.map((dept) => ({
      name: dept.name,
      wards: dept.wards.map((wardName) => ({
        name: wardName,
        rooms: generateRooms(), 
      })),
    }));

    await Department.insertMany(departments);

    console.log("✅ Hospital data with rooms seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedHospitalData();
