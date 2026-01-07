import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  chiefComplaint: { type: String, required: true },
  prediction: {
    diagnosis: { type: String },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
    },
  },
  admittedAt: { type: Date, default: Date.now },
});


const bedSchema = new mongoose.Schema({
  bedNumber: { type: Number, required: true },
  status: {
    type: String,
    enum: ["occupied", "available"],
    default: "available",
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  patient: {
    type: patientSchema,
    default: null,
  },
});


const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  beds: [bedSchema],
});


const wardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rooms: [roomSchema],
});


const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  wards: [wardSchema],
});

export default mongoose.model("Department", departmentSchema);
