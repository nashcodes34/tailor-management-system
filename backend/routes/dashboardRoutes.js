const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const { getTailorDashboard } = require("../controllers/dashboardController");

router.get("/tailor", protect, getTailorDashboard);

module.exports = router;
