require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Startup = require("../models/Startup");

const dummyStartups = [
  {
    name: "TechNova",
    industry: "AI Healthcare Startup",
    location: "Bangalore",
    stage: "Seed Stage",
    description:
      "TechNova is building AI-powered diagnostic tools that help doctors in tier-2 and tier-3 Indian cities detect diseases earlier and faster. Our flagship product analyses medical scans in seconds and flags high-risk cases for review — already piloted in 14 clinics across Karnataka.",
    fundingNeeded: "₹2 Cr",
    teamSize: 12,
    techStack: ["React", "Node.js", "MongoDB", "AWS"],
    jobs: [
      { title: "React Developer", type: "Full-time", location: "Remote" },
      { title: "Backend Developer", type: "Full-time", location: "Bangalore" },
      { title: "UI/UX Designer", type: "Contract", location: "Remote" },
    ],
    founder: { name: "Rahul Sharma", role: "CEO & Co-founder", photoUrl: "" },
    logoInitials: "TN",
  },
  {
    name: "AgroFlow",
    industry: "AgriTech Startup",
    location: "Pune",
    stage: "Series A",
    description:
      "AgroFlow connects small farmers directly to buyers using a mobile-first marketplace, cutting out middlemen and increasing farmer margins by up to 30%.",
    fundingNeeded: "₹5 Cr",
    teamSize: 24,
    techStack: ["React Native", "Express", "PostgreSQL", "GCP"],
    jobs: [
      { title: "Mobile Developer", type: "Full-time", location: "Pune" },
      { title: "Data Analyst", type: "Full-time", location: "Remote" },
    ],
    founder: { name: "Priya Desai", role: "CEO & Founder", photoUrl: "" },
    logoInitials: "AF",
  },
];

const seedDB = async () => {
  await connectDB();
  try {
    await Startup.deleteMany({});
    const created = await Startup.insertMany(dummyStartups);
    console.log(`✅ Seeded ${created.length} startups`);
    console.log(created.map((s) => ({ id: s._id.toString(), name: s.name })));
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
