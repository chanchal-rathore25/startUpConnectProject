const Notification = require("../models/Notification");

/**
 * createNotification — kahin se bhi call karo (controller ya socket handler se)
 * DB me save karta hai + agar io mila to us user ke personal room me
 * real-time bhi bhej deta hai (Navbar ka bell icon turant update ho jaata hai).
 */
async function createNotification({ userId, type, title, message = "", link = "", io }) {
  const notification = await Notification.create({ user: userId, type, title, message, link });

  if (io) {
    io.to(`user:${userId}`).emit("notification:new", {
      id: notification._id,
      type,
      title,
      message,
      link,
      read: false,
      createdAt: notification.createdAt,
    });
  }

  return notification;
}

module.exports = createNotification;
