const Job = require("../models/Job");
const Application = require("../models/Application");

async function getJobs(req, res) {
  try {
    const { query = "", type = "All" } = req.query;
    const filter = {};

    if (type && type !== "All") filter.type = type;
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs.map((j) => j.toPublicJSON()));
  } catch (err) {
    res.status(500).json({ message: "Jobs load nahi ho paaye.", error: err.message });
  }
}

async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Ye job nahi mili — shayad hata di gayi ho." });
    res.json(job.toPublicJSON());
  } catch (err) {
    res.status(404).json({ message: "Ye job nahi mili — shayad hata di gayi ho." });
  }
}

async function applyToJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Ye job nahi mili." });

    const existing = await Application.findOne({ job: job._id, user: req.user.id });
    if (existing) {
      return res.status(409).json({ message: "Aap already apply kar chuke ho." });
    }

    await Application.create({ job: job._id, user: req.user.id });
    job.applicants += 1;
    await job.save();

    res.status(201).json({ message: "Application bhej di gayi.", applicants: job.applicants });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Aap already apply kar chuke ho." });
    }
    res.status(500).json({ message: "Apply nahi ho paaya.", error: err.message });
  }
}

module.exports = { getJobs, getJobById, applyToJob };