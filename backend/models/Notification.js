const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["message", "job_applied", "job_saved", "system"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    link: { type: String, default: "" }, // frontend route jahan click pe le jaana hai
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
