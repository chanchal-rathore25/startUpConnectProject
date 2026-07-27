const User = require("../models/User");

// Security: sirf ye fields hi patch route se update ho sakte hain.
// name/email/password/role isse edit nahi ho sakte.
const PATCHABLE_FIELDS = [
  "bio",
  "skills",
  "github",
  "portfolio",
  "experience",
  "startupName",
  "tagline",
  "stage",
  "fundingAsk",
  "teamSize",
  "firmName",
  "checkSize",
  "sectors",
  "thesis",
  "investmentsCount",
];

async function getMe(req, res) {
  res.json({ user: req.user.toPublicJSON() });
}

async function updateMe(req, res) {
  try {
    const updates = {};
    for (const key of PATCHABLE_FIELDS) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: "Profile update fail ho gaya.", error: err.message });
  }
}

async function uploadResume(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "Koi file mili nahi." });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resumeName: req.file.originalname,
        resumeUrl: `/uploads/resumes/${req.file.filename}`,
      },
      { new: true }
    );

    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: "Resume upload fail ho gaya.", error: err.message });
  }
}

async function uploadPitchDeck(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "Koi file mili nahi." });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        pitchDeckName: req.file.originalname,
        pitchDeckUrl: `/uploads/pitch-decks/${req.file.filename}`,
      },
      { new: true }
    );

    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: "Pitch deck upload fail ho gaya.", error: err.message });
  }
}

module.exports = { getMe, updateMe, uploadResume, uploadPitchDeck };