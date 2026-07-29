const Notification = require("../models/Notification");

// GET /api/notifications
async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: "Notifications load nahi ho payi.", error: err.message });
  }
}

// PATCH /api/notifications/:id/read
async function markAsRead(req, res) {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Update fail ho gaya.", error: err.message });
  }
}

// PATCH /api/notifications/read-all
async function markAllAsRead(req, res) {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Update fail ho gaya.", error: err.message });
  }
}

module.exports = { getNotifications, markAsRead, markAllAsRead };
