const mongoose = require("mongoose");

const measurementFieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      enum: ["cm", "inch"],
      default: "inch",
    },

    required: {
      type: Boolean,
      default: true,
    },

    position: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const measurementTemplateSchema = new mongoose.Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tailor",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    fields: [measurementFieldSchema],

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

measurementTemplateSchema.index({
  tailor: 1,
  name: 1,
});

module.exports = mongoose.model(
  "MeasurementTemplate",
  measurementTemplateSchema,
);
