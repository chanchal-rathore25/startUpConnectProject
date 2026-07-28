const multer = require("multer");
const path = require("path");

// Memory storage: file buffer seedha RAM me rehta hai, phir controller ise
// Cloudinary pe upload kar deta hai. Disk pe kuch save nahi hota — isliye
// Render/Railway jaisi ephemeral-disk hosting pe bhi safe hai.
const storage = multer.memoryStorage();

const resumeFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
  else cb(new Error("Sirf PDF, DOC ya DOCX resume allowed hai."));
};

const deckFilter = (req, file, cb) => {
  const allowed = [".pdf", ".ppt", ".pptx"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
  else cb(new Error("Sirf PDF, PPT ya PPTX pitch deck allowed hai."));
};

const uploadResume = multer({
  storage,
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadPitchDeck = multer({
  storage,
  fileFilter: deckFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

module.exports = { uploadResume, uploadPitchDeck };