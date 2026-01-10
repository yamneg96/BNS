import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    wardName: {
      type: String,
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },

    bedNumbers: [
      {
        type: Number,
        required: true,
      },
    ],

    deptExpiry: {
      type: Date,
      required: true,
    },

    wardExpiry: {
      type: Date,
      required: true,
    },

    note: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
