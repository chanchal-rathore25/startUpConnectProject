const Newsletter = require("../models/Newsletter");

// POST /api/newsletter/subscribe — { email }
async function subscribe(req, res) {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Valid email daalo." });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.json({ message: "Aap already subscribed ho!" });
    }

    await Newsletter.create({ email: email.toLowerCase() });
    res.status(201).json({ message: "Subscribe ho gaye! 🎉" });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ message: "Aap already subscribed ho!" });
    }
    res.status(500).json({ message: "Subscribe nahi ho paaya.", error: err.message });
  }
}

module.exports = { subscribe };
