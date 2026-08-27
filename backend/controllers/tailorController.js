const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Tailor = require("../models/Tailor");

const MeasurementTemplate = require("../models/MeasurementTemplate");

const defaultMeasurementTemplates = require("../utils/defaultMeasurements");

// Generate token
const generateToken = (tailor) => {
  return jwt.sign(
    {
      id: tailor._id,
      role: tailor.role,
      email: tailor.email,
      subscriptionExpiresAt: tailor.subscriptionExpiresAt,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    },
  );
};

// TAILOR LOGIN
const loginTailor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const tailor = await Tailor.findOne({ email });

    if (!tailor) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(password, tailor.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const subscriptionExpired =
      tailor.subscriptionExpiresAt &&
      tailor.subscriptionExpiresAt <= new Date();

    if (subscriptionExpired && tailor.active) {
      tailor.active = false;
      await tailor.save();
    }

    const isActive = tailor.active && !subscriptionExpired;
    const userRole = tailor.role || "tailor";

    if (!isActive) {
      return res.status(403).json({
        message:
          "Your monthly access has ended. Pay the reactivation fee below to restore access.",
      });
    }

    for (const template of defaultMeasurementTemplates) {
      await MeasurementTemplate.create({
        tailor: tailor._id,

        name: template.name,

        description: template.description,

        fields: template.fields,
      });
    }

    res.json({
      message: "Login successful",

      token: generateToken({ ...tailor.toObject(), role: userRole }),

      user: {
        id: tailor._id,

        shopName: tailor.shopName,

        email: tailor.email,

        logo: tailor.logo,

        phone: tailor.phone,

        address: tailor.address,

        active: tailor.active,

        subscriptionExpiresAt: tailor.subscriptionExpiresAt,

        role: userRole,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.user.id).select("-password");

    if (!tailor) {
      return res.status(404).json({
        message: "Tailor not found",
      });
    }

    res.json(tailor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  loginTailor,
  getProfile,
};
