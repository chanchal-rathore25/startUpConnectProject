const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    duration: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["developer", "founder", "investor"], required: true },

    // ---- Developer fields ----
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    resumeName: { type: String, default: null },
    resumeUrl: { type: String, default: null },
    experience: { type: [experienceSchema], default: [] },

    // ---- Founder fields ----
    startupName: { type: String, default: "" },
    tagline: { type: String, default: "" },
    stage: { type: String, default: "Idea" },
    fundingAsk: { type: String, default: "" },
    teamSize: { type: Number, default: 1 },
    pitchDeckName: { type: String, default: null },
    pitchDeckUrl: { type: String, default: null },

    // ---- Investor fields ----
    firmName: { type: String, default: "" },
    checkSize: { type: String, default: "" },
    sectors: { type: [String], default: [] },
    thesis: { type: String, default: "" },
    investmentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Frontend "initials" avatar ke liye — schema me store nahi karte, response bhejte waqt derive karte hain
userSchema.methods.toPublicJSON = function () {
  const initials = this.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    initials,
    createdAt: this.createdAt,
    bio: this.bio,
    skills: this.skills,
    github: this.github,
    portfolio: this.portfolio,
    resumeName: this.resumeName,
    resumeUrl: this.resumeUrl,
    experience: this.experience,
    startupName: this.startupName,
    tagline: this.tagline,
    stage: this.stage,
    fundingAsk: this.fundingAsk,
    teamSize: this.teamSize,
    pitchDeckName: this.pitchDeckName,
    pitchDeckUrl: this.pitchDeckUrl,
    firmName: this.firmName,
    checkSize: this.checkSize,
    sectors: this.sectors,
    thesis: this.thesis,
    investmentsCount: this.investmentsCount,
  };
};

module.exports = mongoose.model("User", userSchema);