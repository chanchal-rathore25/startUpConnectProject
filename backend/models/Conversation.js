const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessageSender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Har participant ke liye alag unread count — {userId: count}
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Do users ke beech sirf ek hi conversation ho — participants ko sorted store karke unique index lagate hain
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
