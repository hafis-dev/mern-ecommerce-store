const multer = require("multer");
const path = require("path");

// Store files in memory, not disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp|avif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb("Only image files are allowed!", false);
  }
};

module.exports = multer({ storage, fileFilter });
