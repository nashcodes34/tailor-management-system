const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Tailor",
    },

    name: String,

    phone: String,

    date: Date,

    measurements: {
      neck: Number,

      chest: Number,

      shoulder: Number,

      armLength: Number,

      sleeve: Number,

      waist: Number,

      hip: Number,

      thigh: Number,

      knee: Number,

      legLength: Number,

      inseam: Number,

      shirtLength: Number,

      trouserLength: Number,

      notes: String,
    },
    measurementUnit: {
      type: String,
      enum: ["inches", "cm"],
      default: "inches",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", customerSchema);
