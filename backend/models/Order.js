const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tailor",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    clothingType: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    deliveryDate: {
      type: Date,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Partially Paid", "Paid"],
      default: "Unpaid",
    },

    status: {
      type: String,
      enum: ["Pending", "Cutting", "Sewing", "Ready", "Delivered", "Cancelled"],
      default: "Pending",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically calculate balance
orderSchema.pre("save", function () {
  this.balance = Math.max(0, this.price - this.amountPaid);
});

module.exports = mongoose.model("Order", orderSchema);
