/**
 * Ek baar ye script chalao taaki DB me demo jobs aa jayein:
 *   node seed/seedJobs.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Job = require("../models/Job");

const jobs = [
  {
    title: "Frontend Developer",
    company: "Nimbus AI",
    logo: "NA",
    logoColor: "from-indigo-500 to-indigo-600",
    location: "Bengaluru",
    type: "Full-time",
    mode: "On-site",
    salary: "₹8L – ₹14L",
    salaryMinLPA: 8,
    experience: "1–3 years",
    experienceMinYrs: 1,
    tags: ["React", "Tailwind", "TypeScript"],
    about:
      "Nimbus AI is building an AI-native analytics platform for growing startups. We ship fast, care deeply about UX, and keep our team lean and senior.",
    description:
      "We're looking for a Frontend Developer to own key parts of our customer-facing dashboard. You'll work closely with design and backend to ship polished, performant UI used by thousands of founders every day.",
    responsibilities: [
      "Build and maintain reusable React components across the product",
      "Collaborate with designers to turn Figma files into pixel-accurate UI",
      "Optimize app performance and Core Web Vitals",
      "Write clean, tested, and documented code",
    ],
    requirements: [
      "1–3 years of experience with React and modern JavaScript",
      "Strong CSS skills — Tailwind experience is a big plus",
      "Familiarity with TypeScript and REST APIs",
      "An eye for detail and good UX instincts",
    ],
    perks: ["Health insurance", "Flexible hours", "Annual learning budget", "ESOPs"],
    companyInfo: { size: "11–50 employees", founded: "2022", website: "nimbus.ai" },
    applicants: 34,
  },
  {
    title: "Backend Engineer (Node.js)",
    company: "GreenGrid",
    logo: "GG",
    logoColor: "from-emerald-500 to-emerald-600",
    location: "Remote",
    type: "Full-time",
    mode: "Remote",
    salary: "₹10L – ₹18L",
    salaryMinLPA: 10,
    experience: "2–4 years",
    experienceMinYrs: 2,
    tags: ["Node.js", "MongoDB", "AWS"],
    about:
      "GreenGrid helps housing societies track and reduce their energy footprint with smart metering. We're a climate-tech startup backed by top VCs.",
    description:
      "As a Backend Engineer, you'll design and scale the APIs that power our IoT metering platform, processing data from thousands of smart meters in real time.",
    responsibilities: [
      "Design and build scalable REST/GraphQL APIs with Node.js",
      "Model and optimize MongoDB schemas for high-write workloads",
      "Set up and maintain AWS infrastructure (EC2, Lambda, S3)",
      "Ensure system reliability with monitoring and alerting",
    ],
    requirements: [
      "2–4 years of backend development experience",
      "Strong knowledge of Node.js, Express, and MongoDB",
      "Experience with AWS or similar cloud platforms",
      "Understanding of system design fundamentals",
    ],
    perks: ["Remote-first culture", "Health insurance", "Home office stipend", "ESOPs"],
    companyInfo: { size: "51–200 employees", founded: "2020", website: "greengrid.io" },
    applicants: 51,
  },
  {
    title: "Product Designer",
    company: "Carto",
    logo: "CT",
    logoColor: "from-purple-500 to-purple-600",
    location: "Pune",
    type: "Part-time",
    mode: "Hybrid",
    salary: "₹40k – ₹60k /mo",
    salaryMinLPA: 5,
    experience: "1–2 years",
    experienceMinYrs: 1,
    tags: ["Figma", "UI/UX"],
    about:
      "Carto is reimagining how local businesses discover and manage their storefronts online, with a design-first approach to every feature we ship.",
    description:
      "We're hiring a Product Designer to shape the end-to-end experience of our merchant dashboard — from early concepts to shipped, polished screens.",
    responsibilities: [
      "Design flows and high-fidelity screens in Figma",
      "Run lightweight user research and usability tests",
      "Maintain and evolve our design system",
      "Partner closely with engineering during implementation",
    ],
    requirements: [
      "1–2 years of product design experience",
      "Strong portfolio showing end-to-end product thinking",
      "Proficiency in Figma",
      "Comfortable working in a hybrid, fast-paced team",
    ],
    perks: ["Flexible hybrid schedule", "Health insurance", "Design conference budget"],
    companyInfo: { size: "11–50 employees", founded: "2023", website: "carto.app" },
    applicants: 22,
  },
  {
    title: "Growth Marketing Intern",
    company: "Nimbus AI",
    logo: "NA",
    logoColor: "from-indigo-500 to-indigo-600",
    location: "Bengaluru",
    type: "Internship",
    mode: "On-site",
    salary: "₹15k /mo",
    salaryMinLPA: 2,
    experience: "0–1 years",
    experienceMinYrs: 0,
    tags: ["SEO", "Content", "Analytics"],
    about:
      "Nimbus AI is building an AI-native analytics platform for growing startups. This internship is a great launchpad into startup marketing.",
    description:
      "Join our growth team to plan and execute campaigns across SEO, content, and paid channels. You'll get real ownership from day one.",
    responsibilities: [
      "Assist in planning and executing SEO and content campaigns",
      "Track and report on key growth metrics",
      "Support paid acquisition experiments",
      "Research competitors and market trends",
    ],
    requirements: [
      "Currently pursuing or recently completed a degree in Marketing/Business",
      "Basic understanding of SEO and analytics tools",
      "Excellent written communication",
      "Eagerness to learn in a fast-paced environment",
    ],
    perks: ["Certificate + letter of recommendation", "Full-time offer for top performers"],
    companyInfo: { size: "11–50 employees", founded: "2022", website: "nimbus.ai" },
    applicants: 89,
  },
  {
    title: "Full Stack Developer (MERN)",
    company: "PayLoop",
    logo: "PL",
    logoColor: "from-blue-500 to-blue-600",
    location: "Remote",
    type: "Full-time",
    mode: "Remote",
    salary: "₹12L – ₹20L",
    salaryMinLPA: 12,
    experience: "2–5 years",
    experienceMinYrs: 2,
    tags: ["React", "Express", "MongoDB"],
    about:
      "PayLoop is building simple, transparent payment infrastructure for Indian startups. We're a small, senior team shipping in production every week.",
    description:
      "We need a Full Stack Developer comfortable owning features end-to-end — from database schema to the React UI a customer finally clicks on.",
    responsibilities: [
      "Build features across our MERN stack, frontend to backend",
      "Design MongoDB schemas and write efficient Express APIs",
      "Build responsive, accessible React interfaces",
      "Participate in code reviews and architecture discussions",
    ],
    requirements: [
      "2–5 years of experience with the MERN stack",
      "Comfortable working across the full stack",
      "Experience with REST API design",
      "Strong ownership mindset — we're a small team",
    ],
    perks: ["Remote-first", "Flexible hours", "Health insurance", "ESOPs"],
    companyInfo: { size: "1–10 employees", founded: "2024", website: "payloop.in" },
    applicants: 12,
  },
  {
    title: "DevOps Engineer",
    company: "GreenGrid",
    logo: "GG",
    logoColor: "from-emerald-500 to-emerald-600",
    location: "Pune",
    type: "Full-time",
    mode: "Hybrid",
    salary: "₹14L – ₹22L",
    salaryMinLPA: 14,
    experience: "3–6 years",
    experienceMinYrs: 3,
    tags: ["Docker", "Kubernetes", "CI/CD"],
    about:
      "GreenGrid helps housing societies track and reduce their energy footprint with smart metering. We're a climate-tech startup backed by top VCs.",
    description:
      "As our DevOps Engineer, you'll own the infrastructure and deployment pipelines that keep our real-time metering platform reliable at scale.",
    responsibilities: [
      "Manage Kubernetes clusters and containerized deployments",
      "Build and maintain CI/CD pipelines",
      "Improve observability with logging, metrics, and alerting",
      "Drive infrastructure cost optimization",
    ],
    requirements: [
      "3–6 years of DevOps/SRE experience",
      "Strong hands-on experience with Docker and Kubernetes",
      "Experience building CI/CD pipelines (GitHub Actions, Jenkins, etc.)",
      "Solid understanding of cloud networking and security",
    ],
    perks: ["Hybrid schedule", "Health insurance", "Home office stipend", "ESOPs"],
    companyInfo: { size: "51–200 employees", founded: "2020", website: "greengrid.io" },
    applicants: 18,
  },
];

async function seed() {
  await connectDB();
  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log(`${jobs.length} jobs seed ho gayi.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});