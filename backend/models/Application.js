const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Ek user ek job pe ek hi baar apply kar sake
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);