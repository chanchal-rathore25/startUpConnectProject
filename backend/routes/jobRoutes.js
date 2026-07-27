const express = require("express");
const { getJobs, getJobById, applyToJob } = require("../controllers/jobController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/:id/apply", protect, applyToJob);

module.exports = router;
