const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Customer = require("../models/Customer");

const getTailorId = (req) => req.user?.id || req.user?._id;

// CREATE PAYMENT
const createPayment = async (req, res) => {
  try {
    const { order, amount, paymentMethod, paymentDate, reference, notes } =
      req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Payment amount must be greater than zero",
      });
    }

    const tailorId = getTailorId(req);

    // Make sure the order belongs to this tailor
    const orderRecord = await Order.findOne({
      _id: order,
      tailor: tailorId,
    });

    if (!orderRecord) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const remainingBalance = orderRecord.balance;

    if (Number(amount) > remainingBalance) {
      return res.status(400).json({
        message: "Payment cannot be greater than the outstanding balance",
      });
    }

    const payment = await Payment.create({
      tailor: tailorId,

      order: orderRecord._id,

      customer: orderRecord.customer,

      amount: Number(amount),

      paymentMethod,

      paymentDate,

      reference,

      notes,
    });

    // Update order totals
    orderRecord.amountPaid =
      Number(orderRecord.amountPaid || 0) + Number(amount);

    orderRecord.balance = Math.max(
      0,
      Number(orderRecord.price) - Number(orderRecord.amountPaid),
    );

    // Automatically mark order as delivered
    // only if it was already delivered.
    // Payment does not control production status.

    await orderRecord.save();

    const populatedPayment = await Payment.findById(payment._id)
      .populate("customer", "name phone")
      .populate("order", "clothingType price");

    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PAYMENTS FOR ORDER
const getOrderPayments = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const order = await Order.findOne({
      _id: req.params.orderId,
      tailor: tailorId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const payments = await Payment.find({
      order: order._id,
      tailor: tailorId,
    }).sort({
      paymentDate: -1,
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PAYMENT
const deletePayment = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const payment = await Payment.findOne({
      _id: req.params.id,
      tailor: tailorId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const order = await Order.findOne({
      _id: payment.order,
      tailor: tailorId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Remove payment from total
    order.amountPaid = Math.max(
      0,
      Number(order.amountPaid) - Number(payment.amount),
    );

    order.balance = Math.max(0, Number(order.price) - Number(order.amountPaid));

    await order.save();

    await payment.deleteOne();

    res.json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PAYMENT
const getPayment = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const payment = await Payment.findOne({
      _id: req.params.id,
      tailor: tailorId,
    })
      .populate("customer", "name phone")
      .populate("order", "clothingType price");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayment,
  getOrderPayments,
  deletePayment,
};
