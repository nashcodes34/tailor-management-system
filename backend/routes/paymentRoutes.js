const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
  createPayment,
  getPayment,
  getOrderPayments,
  deletePayment,
} = require("../controllers/paymentController");

router.use(protect);

router.post("/", createPayment);

router.get("/:id", getPayment);

router.get("/order/:orderId", getOrderPayments);

router.delete("/:id", deletePayment);

module.exports = router;
