const multer = require("multer");
const path = require("path");
const fs = require("fs");

function makeStorage(folder) {
  const dest = path.join(__dirname, "..", "uploads", folder);
  fs.mkdirSync(dest, { recursive: true });
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });
}

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
  storage: makeStorage("resumes"),
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadPitchDeck = multer({
  storage: makeStorage("pitch-decks"),
  fileFilter: deckFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

module.exports = { uploadResume, uploadPitchDeck };
