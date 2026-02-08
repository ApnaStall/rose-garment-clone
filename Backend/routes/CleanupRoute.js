const express = require("express");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const Service = require("../models/Service");

const router = express.Router();

/* --------------------------------------------------
   CONFIG
-------------------------------------------------- */
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const SECRET_HEADER = "x-cleanup-secret";

/* --------------------------------------------------
   HELPER
-------------------------------------------------- */
const isAuthorized = (req) => {
  return req.headers[SECRET_HEADER] === process.env.CLEANUP_SECRET;
};

const collectUsedFiles = async () => {
  const products = await Product.find({}, "product_image");
  const services = await Service.find({}, "service_logo");

  return new Set(
    [...products, ...services]
      .map(item => {
        const url = item.product_image || item.service_logo;
        return url?.split("/uploads/")[1];
      })
      .filter(Boolean)
  );
};

/* --------------------------------------------------
   🟡 DRY RUN (SAFE – NO DELETE)
   GET /api/cleanup/orphan-images
-------------------------------------------------- */
router.get("/orphan-images", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    return res.json({ message: "Uploads folder does not exist" });
  }

  const files = fs.readdirSync(UPLOAD_DIR);
  const usedFiles = await collectUsedFiles();

  const orphanFiles = files.filter(file => !usedFiles.has(file));

  res.json({
    mode: "dry-run",
    orphanCount: orphanFiles.length,
    orphanFiles,
  });
});

/* --------------------------------------------------
   🔴 REAL DELETE
   DELETE /api/cleanup/orphan-images
-------------------------------------------------- */
router.delete("/orphan-images", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    return res.json({ message: "Uploads folder does not exist" });
  }

  const files = fs.readdirSync(UPLOAD_DIR);
  const usedFiles = await collectUsedFiles();

  const deleted = [];

  for (const file of files) {
    if (!usedFiles.has(file)) {
      fs.unlinkSync(path.join(UPLOAD_DIR, file));
      deleted.push(file);
    }
  }

  res.json({
    success: true,
    deletedCount: deleted.length,
    deletedFiles: deleted,
  });
});

module.exports = router;
