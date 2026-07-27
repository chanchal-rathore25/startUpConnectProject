const Startup = require("../models/Startup");

// @desc   Get all startups (used by Search Page / Dashboard)
// @route  GET /api/startups?keyword=&stage=&location=
const getStartups = async (req, res) => {
  try {
    const { keyword, stage, location } = req.query;
    const filter = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { industry: { $regex: keyword, $options: "i" } },
      ];
    }
    if (stage) filter.stage = stage;
    if (location) filter.location = { $regex: location, $options: "i" };

    const startups = await Startup.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: startups.length, data: startups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single startup by id (used by Startup Details Page)
// @route  GET /api/startups/:id
const getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ success: false, message: "Startup not found" });
    }
    res.status(200).json({ success: true, data: startup });
  } catch (error) {
    res.status(500).json({ success: false, message: "Invalid startup id" });
  }
};

// @desc   Create a new startup
// @route  POST /api/startups
const createStartup = async (req, res) => {
  try {
    const startup = await Startup.create(req.body);
    res.status(201).json({ success: true, data: startup });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Update a startup
// @route  PUT /api/startups/:id
const updateStartup = async (req, res) => {
  try {
    const startup = await Startup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!startup) return res.status(404).json({ success: false, message: "Startup not found" });
    res.status(200).json({ success: true, data: startup });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Delete a startup
// @route  DELETE /api/startups/:id
const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findByIdAndDelete(req.params.id);
    if (!startup) return res.status(404).json({ success: false, message: "Startup not found" });
    res.status(200).json({ success: true, message: "Startup deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Toggle "Save Startup" (increments/decrements savedByCount)
// @route  PATCH /api/startups/:id/save
const toggleSaveStartup = async (req, res) => {
  try {
    const { saved } = req.body; // true = save, false = unsave
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ success: false, message: "Startup not found" });

    startup.savedByCount = Math.max(0, startup.savedByCount + (saved ? 1 : -1));
    await startup.save();

    res.status(200).json({ success: true, data: startup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Apply to a startup (increments appliedCount) — used by "Apply" button
// @route  POST /api/startups/:id/apply
const applyToStartup = async (req, res) => {
  try {
    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      { $inc: { appliedCount: 1 } },
      { new: true }
    );
    if (!startup) return res.status(404).json({ success: false, message: "Startup not found" });
    res.status(200).json({ success: true, message: "Application submitted", data: startup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStartups,
  getStartupById,
  createStartup,
  updateStartup,
  deleteStartup,
  toggleSaveStartup,
  applyToStartup,
};
