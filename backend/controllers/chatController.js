const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// GET /api/chat/conversations — logged-in user ki saari conversations, latest pehle
async function getConversations(req, res) {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate("participants", "name role")
      .sort({ lastMessageAt: -1 });

    const result = conversations.map((c) => {
      const other = c.participants.find((p) => String(p._id) !== String(req.user.id));
      return {
        id: c._id,
        otherUser: other
          ? {
              id: other._id,
              name: other.name,
              role: other.role,
              initials: other.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join(""),
            }
          : null,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        lastMessageSender: c.lastMessageSender,
        unreadCount: c.unreadCounts?.get(String(req.user.id)) || 0,
      };
    });

    res.json({ conversations: result });
  } catch (err) {
    res.status(500).json({ message: "Conversations load nahi ho paayi.", error: err.message });
  }
}

// POST /api/chat/conversations/with/:userId — existing conversation lao ya nayi banao
async function getOrCreateConversation(req, res) {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) {
      return res.status(400).json({ message: "Khud ko message nahi kar sakte." });
    }

    const otherUser = await User.findById(userId);
    if (!otherUser) return res.status(404).json({ message: "User nahi mila." });

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, userId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [req.user.id, userId] });
    }

    res.json({
      id: conversation._id,
      otherUser: otherUser.toChatSummary(),
    });
  } catch (err) {
    res.status(500).json({ message: "Conversation start nahi ho paayi.", error: err.message });
  }
}

// GET /api/chat/conversations/:id/messages?page=1
async function getMessages(req, res) {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: "Conversation nahi mili." });
    if (!conversation.participants.some((p) => String(p) === req.user.id)) {
      return res.status(403).json({ message: "Ye conversation aapki nahi hai." });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 30;

    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Mark as read + reset unread count for this user
    await Message.updateMany(
      { conversation: conversation._id, sender: { $ne: req.user.id }, readBy: { $ne: req.user.id } },
      { $addToSet: { readBy: req.user.id } }
    );
    conversation.unreadCounts.set(String(req.user.id), 0);
    await conversation.save();

    res.json({ messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ message: "Messages load nahi ho paaye.", error: err.message });
  }
}

module.exports = { getConversations, getOrCreateConversation, getMessages };
