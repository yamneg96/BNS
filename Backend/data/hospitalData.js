import 'dotenv/config'; 
import Department from "../models/Department.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";
import School from "../models/School.js";


const schoolsTemplate = [
  {
    name: "Medicine School",
    image: "/assets/homeImage.jpg",
    description: "Comprehensive medical training, patient care, and research.",
    departments: ["Internal Medicine", "GynObs", "Pediatrics", "Surgery", "Emergency", "Dermatology", "Psychiatry", "ENT", "Ophthalmology"],
  },
  {
    name: "Lab School",
    image: "/assets/hospitalHallway.jpg",
    description: "Dedicated to clinical laboratory science and diagnostics.",
    departments: ["Internal Medicine", "GynObs", "Pediatrics", "Surgery"],
  },
];


const departmentsTemplate = [
  {
    name: "Internal Medicine",
    wards: ["Ward C", "Ward D", "Inpatient", "Stroke", "Kalazar"],
  },
  {
    name: "GynObs",
    wards: ["Labor", "M1 up", "M1 down", "M2 (post natal)", "M3 (high risk)", "Gyn ward", "Michu", "Fistula"],
  },
  {
    name: "Pediatrics",
    wards: ["ETAT", "Emergency", "Main ward (under 5 and above 5)", "Nutrition and infant", "Hemato Oncology", "NICU"],
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


const generateBeds = async (users) => {
  return Array.from({ length: 50 }, (_, i) => {
    const assignedUser = Math.random() < 0.5 
      ? users[Math.floor(Math.random() * users.length)]._id 
      : null;
    return {
      id: i + 1,
      status: assignedUser ? "occupied" : "available",
      assignedUser,
    };
  });
};

const seedHospitalData = async () => {
  try {
    await connectDB();
    const users = await User.find();

    await Department.deleteMany();
    await School.deleteMany();

    // 1. Seed Departments
    const departmentDocs = {}; // store refs by name
    for (const dept of departmentsTemplate) {
      const wards = [];
      for (const wardName of dept.wards) {
        const beds = await generateBeds(users);
        wards.push({ name: wardName, beds });
      }
      const createdDept = await Department.create({
        name: dept.name,
        wards,
      });
      departmentDocs[dept.name] = createdDept._id;
    }

    // 2. Seed Schools with linked departments
    for (const school of schoolsTemplate) {
      const deptIds = school.departments.map((d) => departmentDocs[d]);
      await School.create({
        name: school.name,
        image: school.image,
        description: school.description,
        departments: deptIds,
      });
    }

    console.log("✅ Schools + Departments + Wards + Beds seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedHospitalData();
