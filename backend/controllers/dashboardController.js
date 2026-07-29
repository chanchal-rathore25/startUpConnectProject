const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

// Role ke hisaab se kaunse fields "complete" profile ke liye zaroori hain
function calculateProfileCompletion(user) {
  let fields = [];
  if (user.role === "developer") {
    fields = [user.bio, user.skills?.length > 0, user.github, user.portfolio, user.resumeUrl, user.experience?.length > 0];
  } else if (user.role === "founder") {
    fields = [user.startupName, user.tagline, user.fundingAsk, user.teamSize > 0, user.pitchDeckUrl];
  } else {
    fields = [user.firmName, user.checkSize, user.sectors?.length > 0, user.thesis, user.investmentsCount > 0];
  }
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

// GET /api/dashboard
async function getDashboard(req, res) {
  try {
    const user = req.user;

    // Applied jobs (with application details)
    const applications = await Application.find({ user: user.id })
      .populate("job")
      .sort({ createdAt: -1 });
    const appliedJobs = applications
      .filter((a) => a.job)
      .map((a) => ({ ...a.job.toPublicJSON(), appliedAt: a.createdAt, status: a.status }));

    // Saved jobs
    const savedDocs = await SavedJob.find({ user: user.id }).populate("job").sort({ createdAt: -1 });
    const savedJobs = savedDocs.filter((s) => s.job).map((s) => ({ ...s.job.toPublicJSON(), savedByMe: true }));

    // Recommended jobs — developer ke skills se match karne wali jobs jo already
    // apply/save nahi ki gayi hain. Founder/Investor ke liye abhi latest jobs hi dikha dete hain.
    const excludeIds = [
      ...appliedJobs.map((j) => j.id),
      ...savedJobs.map((j) => j.id),
    ];
    let recommendedFilter = { _id: { $nin: excludeIds } };
    if (user.role === "developer" && user.skills?.length > 0) {
      recommendedFilter.tags = { $in: user.skills };
    }
    let recommendedJobs = await Job.find(recommendedFilter).sort({ createdAt: -1 }).limit(4);
    // Agar skill-match se kuch nahi mila, latest jobs se fallback fill karo
    if (recommendedJobs.length === 0) {
      recommendedJobs = await Job.find({ _id: { $nin: excludeIds } }).sort({ createdAt: -1 }).limit(4);
    }

    // Recent jobs — sabse latest posted jobs, overall platform activity dikhane ke liye
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      name: user.name,
      role: user.role,
      profileCompletion: calculateProfileCompletion(user),
      stats: {
        appliedCount: appliedJobs.length,
        savedCount: savedJobs.length,
      },
      appliedJobs: appliedJobs.slice(0, 5),
      savedJobs: savedJobs.slice(0, 5),
      recommendedJobs: recommendedJobs.map((j) => j.toPublicJSON()),
      recentJobs: recentJobs.map((j) => j.toPublicJSON()),
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard load nahi ho paaya.", error: err.message });
  }
}

module.exports = { getDashboard };