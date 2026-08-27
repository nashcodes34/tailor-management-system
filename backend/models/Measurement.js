const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tailor",
      required: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MeasurementTemplate",
      required: true,
    },

    garmentName: {
      type: String,
      required: true,
    },

    unit: {
      type: String,
      enum: ["cm", "inch"],
      default: "inch",
    },

    values: {
      type: Map,
      of: Number,
      default: {},
    },

    notes: {
      type: String,
      trim: true,
    },

    measuredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Measurement", measurementSchema);
