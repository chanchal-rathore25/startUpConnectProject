const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Apply karte waqt ka snapshot — baad me user resume badal de to bhi
    // ye application apne original resume se linked rahegi.
    resumeUrl: { type: String, default: null },
    coverLetter: { type: String, default: "" },
    expectedSalary: { type: String, default: "" },

    status: { 
      type: String,
      enum: ["submitted", "reviewed", "shortlisted", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

// Ek user ek job pe ek hi baar apply kar sake
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
