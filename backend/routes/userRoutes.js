const express = require("express");
const { getMe, updateMe, uploadResume, uploadPitchDeck } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { uploadResume: resumeUpload, uploadPitchDeck: deckUpload } = require("../middleware/upload");

const router = express.Router();

router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.post("/me/resume", protect, resumeUpload.single("resume"), uploadResume);
router.post("/me/pitch-deck", protect, deckUpload.single("pitchDeck"), uploadPitchDeck);

module.exports = router;
