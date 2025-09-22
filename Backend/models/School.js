import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // optional
  description: { type: String },
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // reference to your existing Department schema
    },
  ],
});

export default mongoose.model("School", schoolSchema);
