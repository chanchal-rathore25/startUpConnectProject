const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const createNotification = require("../utils/createNotification");

// userId -> Set of socket ids (ek user multiple tabs/devices se connected ho sakta hai)
const onlineUsers = new Map();

function addOnlineSocket(userId, socketId) {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
}

function removeOnlineSocket(userId, socketId) {
  const set = onlineUsers.get(userId);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) onlineUsers.delete(userId);
}

function isUserOnline(userId) {
  return onlineUsers.has(String(userId));
}

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
  });

  // Handshake pe JWT verify karo — token connect karte waqt socket.auth.token me aata hai
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Login zaroori hai."));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User nahi mila."));
      socket.userId = String(user._id);
      socket.userName = user.name;
      next();
    } catch {
      next(new Error("Invalid ya expired token."));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    addOnlineSocket(userId, socket.id);

    // Apna personal room join karo — isse seedha is user ko message bheja ja sakta hai
    socket.join(`user:${userId}`);

    // Sabko batao ye user online ho gaya
    io.emit("presence:online", { userId });

    // Client ek specific conversation room join kar sakta hai (jab chat window khule)
    socket.on("conversation:join", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Naya message bhejna
    socket.on("message:send", async ({ conversationId, text }, callback) => {
      try {
        if (!text?.trim()) return;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.some((p) => String(p) === userId)) {
          return callback?.({ error: "Conversation nahi mili." });
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          text: text.trim(),
          readBy: [userId],
        });

        conversation.lastMessage = text.trim();
        conversation.lastMessageAt = new Date();
        conversation.lastMessageSender = userId;

        // Doosre participant ka unread count badhao
        const otherParticipant = conversation.participants.find((p) => String(p) !== userId);
        if (otherParticipant) {
          const key = String(otherParticipant);
          const current = conversation.unreadCounts.get(key) || 0;
          conversation.unreadCounts.set(key, current + 1);
        }
        await conversation.save();

        const payload = {
          id: message._id,
          conversationId,
          sender: userId,
          text: message.text,
          createdAt: message.createdAt,
        };

        // Conversation room ke sabhi (jo chat khole baithe hain) ko turant dikhao
        io.to(`conversation:${conversationId}`).emit("message:new", payload);
        // Doosre user ko uske personal room me bhi bhejo (agar wo chat list pe hai, badge update ho)
        if (otherParticipant) {
          io.to(`user:${otherParticipant}`).emit("conversation:updated", {
            conversationId,
            lastMessage: message.text,
            lastMessageAt: message.createdAt,
          });

          // Recipient ko notification bhi bhejo (bell icon + DB me save)
          await createNotification({
            userId: otherParticipant,
            type: "message",
            title: `New message from ${socket.userName}`,
            message: message.text.slice(0, 80),
            link: `/chat/${conversationId}`,
            io,
          });
        }

        callback?.({ success: true, message: payload });
      } catch (err) {
        callback?.({ error: err.message || "Message bhej nahi paaye." });
      }
    });

    // Typing indicator
    socket.on("typing:start", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:start", { conversationId, userId });
    });
    socket.on("typing:stop", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:stop", { conversationId, userId });
    });

    socket.on("disconnect", async () => {
      removeOnlineSocket(userId, socket.id);
      if (!isUserOnline(userId)) {
        // Sab tabs disconnect ho gaye — lastSeen update karo aur offline broadcast karo
        try {
          await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
        } catch {
          // ignore
        }
        io.emit("presence:offline", { userId, lastSeen: new Date() });
      }
    });
  });

  return io;
}

module.exports = { initSocket, isUserOnline };