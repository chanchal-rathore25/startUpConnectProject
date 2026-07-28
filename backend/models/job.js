const mongoose = require("mongoose");
 
const companyInfoSchema = new mongoose.Schema(
  {
    size: { type: String, default: "" },
    founded: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { _id: false }
);
 
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    logo: { type: String, required: true },
    logoColor: { type: String, default: "from-indigo-500 to-indigo-600" },
    location: { type: String, required: true },
    type: { type: String, enum: ["Full-time", "Part-time", "Internship"], required: true },
    mode: { type: String, default: "On-site" },
    salary: { type: String, required: true },
    salaryMinLPA: { type: Number, default: 0 }, // filter ke liye — e.g. "₹8L–14L" -> 8
    experience: { type: String, default: "" },
    experienceMinYrs: { type: Number, default: 0 }, // filter ke liye — e.g. "2–4 years" -> 2
    tags: { type: [String], default: [] },
    about: { type: String, default: "" },
    description: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    perks: { type: [String], default: [] },
    companyInfo: { type: companyInfoSchema, default: () => ({}) },
    applicants: { type: Number, default: 0 },
  },
  { timestamps: true }
);
 
// "Posted 2 days ago" jaisa relative label frontend ko response me bhejte hain
jobSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  obj.posted = timeAgo(obj.createdAt);
  return obj;
};
 
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
}
 
// Search ke liye text index — title, company, tags, location sab cover karta hai
jobSchema.index({ title: "text", company: "text", tags: "text", location: "text" });
 
module.exports = mongoose.model("Job", jobSchema);
