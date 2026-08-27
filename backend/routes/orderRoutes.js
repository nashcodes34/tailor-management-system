const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { protect } = require("../middleware/auth");

// All order routes require authentication
router.use(protect);

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getOrder);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

module.exports = router;
