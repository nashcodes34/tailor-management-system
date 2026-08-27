const express = require("express");

const router = express.Router();

const { loginTailor, getProfile } = require("../controllers/tailorController");

const { protect, tailorOnly } = require("../middleware/auth");

// POST /api/tailor/login
router.post("/login", loginTailor);

// GET /api/tailor/profile
router.get("/profile", protect, tailorOnly, getProfile);

module.exports = router;
