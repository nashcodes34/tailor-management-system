const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
  getTemplates,
  createMeasurement,
  getCustomerMeasurements,
  getMeasurement,
  deleteMeasurement,
} = require("../controllers/measurementController");

router.use(protect);

// Templates
router.get("/templates", getTemplates);

// Create
router.post("/", createMeasurement);

// Customer history
router.get("/customer/:customerId", getCustomerMeasurements);

// Single measurement
router.get("/:id", getMeasurement);

// Delete
router.delete("/:id", deleteMeasurement);

module.exports = router;
