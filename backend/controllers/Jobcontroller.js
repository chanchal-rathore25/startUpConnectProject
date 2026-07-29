const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

/**
 * GET /api/jobs
 * Query params:
 *   query       — search text (title, company, tags, location)
 *   type        — Full-time | Part-time | Internship | All
 *   mode        — Remote | Hybrid | On-site | All
 *   minSalary   — number (LPA) — jobs with salaryMinLPA >= minSalary
 *   minExperience — number (years) — jobs with experienceMinYrs >= minExperience
 *   page        — default 1
 *   limit       — default 9
 * Response: { jobs, total, page, totalPages }
 */
async function getJobs(req, res) {
  try {
    const { query = "", type = "All", mode = "All", minSalary, minExperience } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 9));

    const filter = {};
    if (type && type !== "All") filter.type = type;
    if (mode && mode !== "All") filter.mode = mode;
    if (minSalary) filter.salaryMinLPA = { $gte: Number(minSalary) };
    if (minExperience) filter.experienceMinYrs = { $gte: Number(minExperience) };

    if (query.trim()) {
      const regex = { $regex: query.trim(), $options: "i" };
      filter.$or = [{ title: regex }, { company: regex }, { location: regex }, { tags: regex }];
    }

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Agar user logged in hai, dikhao kaunsi jobs already save ki hui hain
    let savedJobIds = new Set();
    if (req.user) {
      const saved = await SavedJob.find({ user: req.user.id }).select("job");
      savedJobIds = new Set(saved.map((s) => String(s.job)));
    }

    res.json({
      jobs: jobs.map((j) => ({ ...j.toPublicJSON(), savedByMe: savedJobIds.has(String(j._id)) })),
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    res.status(500).json({ message: "Jobs load nahi ho paaye.", error: err.message });
  }
}

async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Ye job nahi mili — shayad hata di gayi ho." });

    let savedByMe = false;
    let appliedByMe = false;
    if (req.user) {
      savedByMe = !!(await SavedJob.exists({ user: req.user.id, job: job._id }));
      appliedByMe = !!(await Application.exists({ user: req.user.id, job: job._id }));
    }

    res.json({ ...job.toPublicJSON(), savedByMe, appliedByMe });
  } catch (err) {
    res.status(404).json({ message: "Ye job nahi mili — shayad hata di gayi ho." });
  }
}

// POST /api/jobs/:id/save — toggle save/unsave
async function toggleSaveJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Ye job nahi mili." });

    const existing = await SavedJob.findOne({ user: req.user.id, job: job._id });
    if (existing) {
      await existing.deleteOne();
      return res.json({ saved: false, message: "Job unsaved." });
    }

    await SavedJob.create({ user: req.user.id, job: job._id });
    res.json({ saved: true, message: "Job saved." });
  } catch (err) {
    res.status(500).json({ message: "Save nahi ho paaya.", error: err.message });
  }
}

// GET /api/jobs/saved/all — logged-in user ki saari saved jobs
async function getSavedJobs(req, res) {
  try {
    const saved = await SavedJob.find({ user: req.user.id }).populate("job").sort({ createdAt: -1 });
    const jobs = saved.filter((s) => s.job).map((s) => ({ ...s.job.toPublicJSON(), savedByMe: true }));
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Saved jobs load nahi ho paayi.", error: err.message });
  }
}

// POST /api/jobs/:id/apply — { coverLetter, expectedSalary }
async function applyToJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Ye job nahi mili." });

    const existing = await Application.findOne({ job: job._id, user: req.user.id });
    if (existing) {
      return res.status(409).json({ message: "Aap already apply kar chuke ho." });
    }

    const { coverLetter = "", expectedSalary = "" } = req.body;
    const applicant = await User.findById(req.user.id);

    if (!applicant.resumeUrl) {
      return res.status(400).json({ message: "Apply karne se pehle apna resume profile me upload karo." });
    }

    await Application.create({
      job: job._id,
      user: req.user.id,
      resumeUrl: applicant.resumeUrl,
      coverLetter,
      expectedSalary,
    });

    job.applicants += 1;
    await job.save();

    // Applicant ko confirmation notification bhejo (real-time + DB me save)
    await createNotification({
      userId: req.user.id,
      type: "job_applied",
      title: "Application submitted ✅",
      message: `Aapne ${job.title} at ${job.company} ke liye apply kiya.`,
      link: `/jobs/${job._id}`,
      io: req.app.get("io"),
    });

    res.status(201).json({ message: "Application bhej di gayi.", applicants: job.applicants });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Aap already apply kar chuke ho." });
    }
    res.status(500).json({ message: "Apply nahi ho paaya.", error: err.message });
  }
}

module.exports = { getJobs, getJobById, toggleSaveJob, getSavedJobs, applyToJob };