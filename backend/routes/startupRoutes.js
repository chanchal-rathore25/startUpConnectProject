const express = require("express");
const router = express.Router();
const {
  getStartups,
  getStartupById,
  createStartup,
  updateStartup,
  deleteStartup,
  toggleSaveStartup,
  applyToStartup,
} = require("../controllers/startupController");

router.route("/").get(getStartups).post(createStartup);
router.route("/:id").get(getStartupById).put(updateStartup).delete(deleteStartup);
router.route("/:id/save").patch(toggleSaveStartup);
router.route("/:id/apply").post(applyToStartup);

module.exports = router;
