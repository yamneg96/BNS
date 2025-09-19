import Notification from "../models/Notification.js";

export const getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("from", "name email") // bring sender info
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
