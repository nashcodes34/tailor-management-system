const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tailor",
      required: true,
    },
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "GHS" },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paidAt: Date,
    expiresAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
