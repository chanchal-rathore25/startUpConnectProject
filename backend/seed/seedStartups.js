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
  {
    name: "PayLoop",
    industry: "Fintech Startup",
    location: "Mumbai",
    stage: "Seed Stage",
    description:
      "PayLoop builds simple, transparent payment infrastructure for Indian D2C brands — instant settlements, zero hidden fees, and a dashboard founders actually understand.",
    fundingNeeded: "₹3.5 Cr",
    teamSize: 8,
    techStack: ["React", "Express", "MongoDB", "Razorpay API"],
    jobs: [
      { title: "Full Stack Developer (MERN)", type: "Full-time", location: "Remote" },
      { title: "DevOps Engineer", type: "Full-time", location: "Mumbai" },
    ],
    founder: { name: "Arjun Mehta", role: "CEO & Co-founder", photoUrl: "" },
    logoInitials: "PL",
  },
  {
    name: "ClassKart",
    industry: "EdTech Startup",
    location: "Delhi NCR",
    stage: "Series A",
    description:
      "ClassKart is a vernacular-first learning platform helping students in Tier 2/3 towns prepare for competitive exams through bite-sized video lessons and live doubt-solving in 8 regional languages.",
    fundingNeeded: "₹8 Cr",
    teamSize: 35,
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Azure"],
    jobs: [
      { title: "Frontend Developer", type: "Full-time", location: "Delhi NCR" },
      { title: "Content Strategist", type: "Full-time", location: "Remote" },
      { title: "Growth Marketing Intern", type: "Internship", location: "Delhi NCR" },
    ],
    founder: { name: "Sneha Kapoor", role: "CEO & Founder", photoUrl: "" },
    logoInitials: "CK",
  },
  {
    name: "GreenGrid",
    industry: "Climate Tech Startup",
    location: "Hyderabad",
    stage: "Series A",
    description:
      "GreenGrid helps housing societies and small factories track and reduce their energy footprint with affordable smart metering hardware and a real-time analytics dashboard.",
    fundingNeeded: "₹6 Cr",
    teamSize: 28,
    techStack: ["React", "Node.js", "MongoDB", "AWS IoT"],
    jobs: [
      { title: "Backend Engineer (Node.js)", type: "Full-time", location: "Remote" },
      { title: "DevOps Engineer", type: "Full-time", location: "Hyderabad" },
      { title: "Hardware Engineer", type: "Full-time", location: "Hyderabad" },
    ],
    founder: { name: "Karan Verma", role: "CEO & Co-founder", photoUrl: "" },
    logoInitials: "GG",
  },
  {
    name: "Carto",
    industry: "SaaS Startup",
    location: "Pune",
    stage: "Pre-seed",
    description:
      "Carto helps local businesses build and manage their online storefront in minutes — no code, no design skills, just a link to share on WhatsApp and Instagram.",
    fundingNeeded: "₹1 Cr",
    teamSize: 6,
    techStack: ["React", "Tailwind", "Firebase", "Figma"],
    jobs: [
      { title: "Product Designer", type: "Part-time", location: "Pune" },
      { title: "Frontend Developer", type: "Contract", location: "Remote" },
    ],
    founder: { name: "Ananya Iyer", role: "Founder", photoUrl: "" },
    logoInitials: "CT",
  },
  {
    name: "Nimbus AI",
    industry: "AI Analytics Startup",
    location: "Bangalore",
    stage: "Seed Stage",
    description:
      "Nimbus AI gives early-stage startups an AI-native analytics layer over their product data — plain-English queries instead of SQL, and daily insight digests founders actually read.",
    fundingNeeded: "₹4 Cr",
    teamSize: 15,
    techStack: ["React", "Python", "MongoDB", "OpenAI API"],
    jobs: [
      { title: "Frontend Developer", type: "Full-time", location: "Bangalore" },
      { title: "Growth Marketing Intern", type: "Internship", location: "Bangalore" },
    ],
    founder: { name: "Vikram Rao", role: "CEO & Co-founder", photoUrl: "" },
    logoInitials: "NA",
  },
  {
    name: "SwiftDrop",
    industry: "Logistics Startup",
    location: "Chennai",
    stage: "Series B",
    description:
      "SwiftDrop is a last-mile delivery network for D2C brands, offering 24-hour delivery across 40+ Indian cities through a hyperlocal network of micro-warehouses.",
    fundingNeeded: "₹15 Cr",
    teamSize: 90,
    techStack: ["React", "Java", "PostgreSQL", "Kubernetes"],
    jobs: [
      { title: "Backend Engineer (Java)", type: "Full-time", location: "Chennai" },
      { title: "Operations Manager", type: "Full-time", location: "Chennai" },
      { title: "Data Analyst", type: "Full-time", location: "Remote" },
    ],
    founder: { name: "Divya Nair", role: "CEO & Co-founder", photoUrl: "" },
    logoInitials: "SD",
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
