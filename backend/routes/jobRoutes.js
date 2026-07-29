const express = require("express");
const { getJobs, getJobById, toggleSaveJob, getSavedJobs, applyToJob } = require("../controllers/jobController");
const { protect, optionalProtect } = require("../middleware/auth");

const router = express.Router();

// IMPORTANT: /saved/all route /:id se pehle aani chahiye, warna "saved" ko
// job id samajh liya jayega.
router.get("/saved/all", protect, getSavedJobs);

router.get("/", optionalProtect, getJobs);
router.get("/:id", optionalProtect, getJobById);
router.post("/:id/save", protect, toggleSaveJob);
router.post("/:id/apply", protect, applyToJob);

module.exports = router;