
import User from "../models/User.js";
import imagekit from "../config/imageKit.js";
import { sendEmailToAdmins } from "../utils/notificationtoAdmin.js";

export const uploadPaymentScreenshot = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `payment_${user._id}_${Date.now()}`,
      folder: "/payment_screenshots",
    });

    user.subscription.paymentScreenshot = uploadResponse.url;
    await user.save();

    
    await sendEmailToAdmins(
      `Payment Screenshot Uploaded by ${user.name || user.email}`,
      `User <strong>${user.name || user.email}</strong> uploaded a payment screenshot.<br>
       <a href="${uploadResponse.url}">View Screenshot</a><br><br>
       Please verify and activate their subscription.`
    );

    res.status(200).json({
      message: "Payment screenshot uploaded successfully. Admins notified.",
      screenshotUrl: uploadResponse.url,
    });
  } catch (err) {
    console.error("Error uploading payment screenshot:", err);
    res.status(500).json({ message: "Error uploading payment screenshot", error: err.message });
  }
};



