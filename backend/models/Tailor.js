const mongoose = require("mongoose");

const tailorSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    logo: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      default: "tailor",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    currency: {
      type: String,
      default: "GHS",
    },

    active: {
      type: Boolean,
      default: true,
    },

    subscriptionExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Tailor", tailorSchema);
