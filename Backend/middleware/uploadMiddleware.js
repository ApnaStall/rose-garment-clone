const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ABSOLUTE uploads path (CRITICAL for Render + local)
const uploadDir = path.join(process.cwd(), "uploads");

// ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // original name without extension
    const baseName = path.basename(file.originalname, ext);

    // make filename URL-safe
    const safeBaseName = baseName
      .toLowerCase()
      .replace(/\s+/g, "%20")          // spaces → %20
      .replace(/[^a-z0-9%_-]/g, "");   // remove unsafe chars

    const MAX_LENGTH = 100; // safe filename length (incl. extension)

    let finalName;

    if ((safeBaseName + ext).length <= MAX_LENGTH) {
      // ✅ keep original name if short enough
      finalName = safeBaseName + ext;
    } else {
      // ❌ too long → rename
      finalName = `Product_${Date.now()}${ext}`;
    }

    console.log("📁 Uploaded file saved as:", finalName);
    cb(null, finalName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

module.exports = upload;
