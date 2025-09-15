
import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["occupied", "available"], 
    default: "available" 
  },
  assignedUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",   //  Reference to User schema
    default: null 
  },
});

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  beds: [bedSchema],
});

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  wards: [wardSchema],
});

export default mongoose.model("Department", departmentSchema);
