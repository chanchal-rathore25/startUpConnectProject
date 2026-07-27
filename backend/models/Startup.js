const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, default: "Full-time" }, // e.g. Full-time, Contract, Remote
    location: { type: String, default: "Remote" },
  },
  { _id: true }
);

const founderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "Founder" },
    photoUrl: { type: String, default: "" },
  },
  { _id: false }
);

const startupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, required: true }, // e.g. "AI Healthcare Startup"
    location: { type: String, required: true },
    stage: {
      type: String,
      enum: ["Idea Stage", "Seed Stage", "Series A", "Series B+", "Bootstrapped"],
      default: "Seed Stage",
    },
    description: { type: String, required: true },
    fundingNeeded: { type: String, required: true }, // e.g. "₹2 Cr"
    teamSize: { type: Number, required: true },
    techStack: [{ type: String }],
    jobs: [jobSchema],
    founder: founderSchema,
    logoInitials: { type: String, default: "" },
    savedByCount: { type: Number, default: 0 },
    appliedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Startup", startupSchema);
