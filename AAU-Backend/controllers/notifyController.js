import Notification from "../models/Notification.js";

export const getNotificationsForUser = async (req, res) => {
    try {
        const {
            departmentName,
            wardName,
            roomNumber,
            bedNumber,
            read,
        } = req.query;

        const query = { user: req.user._id };

        // Room-aware filters
        if (departmentName) query.departmentName = departmentName;
        if (wardName) query.wardName = wardName;
        if (roomNumber) query.roomNumber = roomNumber;
        if (bedNumber) query.bedNumber = Number(bedNumber);
        if (read !== undefined) query.read = read === "true";

        const notifications = await Notification.find(query)
            .populate("from", "name email image")
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getUnreadNotificationCount = async (req, res) => {
    try {
        const { departmentName, wardName, roomNumber } = req.query;

        const query = {
            user: req.user._id,
            read: false,
        };

        if (departmentName) query.departmentName = departmentName;
        if (wardName) query.wardName = wardName;
        if (roomNumber) query.roomNumber = roomNumber;

        const count = await Notification.countDocuments(query);

        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
