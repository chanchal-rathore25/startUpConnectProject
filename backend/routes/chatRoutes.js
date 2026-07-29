const express = require("express");
const { getConversations, getOrCreateConversation, getMessages } = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.post("/conversations/with/:userId", protect, getOrCreateConversation);
router.get("/conversations/:id/messages", protect, getMessages);

module.exports = router;
