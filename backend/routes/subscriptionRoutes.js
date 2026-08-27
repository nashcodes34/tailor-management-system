const express = require("express");
const {
  initializeSubscription,
  verifySubscription,
} = require("../controllers/subscriptionController");

const router = express.Router();
router.post("/initialize", initializeSubscription);
router.get("/verify/:reference", verifySubscription);

module.exports = router;
