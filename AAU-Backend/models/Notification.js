import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // recipient
    },

    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // sender
    },

    type: {
      type: String,
      enum: ["admit", "discharge"],
      required: true,
    },

    departmentName: {
      type: String,
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

    bedNumber: {
      type: Number,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
