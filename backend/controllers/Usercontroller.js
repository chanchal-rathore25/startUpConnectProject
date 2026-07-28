const User = require("../models/User");
const { uploadBufferToCloudinary } = require("../config/cloudinary");

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

// Resume ko Cloudinary pe upload karta hai, DB me sirf secure_url save hota hai
async function uploadResume(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "Koi file mili nahi." });

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "startupconnect/resumes",
      filename: `${req.user.id}-${Date.now()}`,
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resumeName: req.file.originalname, resumeUrl: result.secure_url },
      { new: true }
    );

    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: "Resume upload fail ho gaya.", error: err.message });
  }
}

// Pitch deck ko bhi Cloudinary pe upload karta hai
async function uploadPitchDeck(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "Koi file mili nahi." });

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "startupconnect/pitch-decks",
      filename: `${req.user.id}-${Date.now()}`,
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { pitchDeckName: req.file.originalname, pitchDeckUrl: result.secure_url },
      { new: true }
    );

    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: "Pitch deck upload fail ho gaya.", error: err.message });
  }
}

module.exports = { getMe, updateMe, uploadResume, uploadPitchDeck };
