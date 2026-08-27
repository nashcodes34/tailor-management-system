const express = require("express");

const router = express.Router();

const {
  loginAdmin,
  createTailor,
  getTailors,
  getTailor,
  updateTailor,
  deleteTailor,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/auth");

const upload = require("../middleware/upload");

// POST /api/admin/login
router.post("/login", loginAdmin);

// GET /api/admin/tailors
router.get("/tailors", protect, adminOnly, getTailors);

// GET /api/admin/tailors/:id
router.get("/tailors/:id", protect, adminOnly, getTailor);

// POST /api/admin/tailors
router.post(
  "/tailors",
  protect,
  adminOnly,
  upload.single("logo"),
  createTailor,
);

// PUT /api/admin/tailors/:id
router.put(
  "/tailors/:id",
  protect,
  adminOnly,
  upload.single("logo"),
  updateTailor,
);

// DELETE /api/admin/tailors/:id
router.delete("/tailors/:id", protect, adminOnly, deleteTailor);

module.exports = router;

// POST    /api/admin/login
// GET     /api/admin/tailors
// GET     /api/admin/tailors/:id
// POST    /api/admin/tailors
// PUT     /api/admin/tailors/:id
// DELETE  /api/admin/tailors/:id
