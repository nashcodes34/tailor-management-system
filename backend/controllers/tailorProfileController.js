const Tailor = require("../models/Tailor");

const bcrypt = require("bcryptjs");

const fs = require("fs");

const path = require("path");

const getTailorId = (req) => req.user?.id || req.user?._id;

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const tailor = await Tailor.findById(tailorId).select("-password");

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

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const tailorId = getTailorId(req);
    const { shopName, phone, address, description, currency } = req.body;

    const tailor = await Tailor.findById(tailorId);

    if (!tailor) {
      return res.status(404).json({
        message: "Tailor not found",
      });
    }

    if (shopName !== undefined) {
      tailor.shopName = shopName;
    }

    if (phone !== undefined) {
      tailor.phone = phone;
    }

    if (address !== undefined) {
      tailor.address = address;
    }

    if (description !== undefined) {
      tailor.description = description;
    }

    if (currency !== undefined) {
      tailor.currency = currency;
    }

    await tailor.save();

    const result = tailor.toObject();

    delete result.password;

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPLOAD LOGO
const uploadLogo = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a logo",
      });
    }

    const tailor = await Tailor.findById(tailorId);

    if (!tailor) {
      return res.status(404).json({
        message: "Tailor not found",
      });
    }

    // Delete old logo
    if (tailor.logo) {
      const oldLogoPath = path.join(__dirname, "..", tailor.logo);

      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    tailor.logo = `/uploads/logos/${req.file.filename}`;

    await tailor.save();

    res.json({
      message: "Logo uploaded successfully",

      logo: tailor.logo,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const tailorId = getTailorId(req);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new passwords are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must contain at least 6 characters",
      });
    }

    const tailor = await Tailor.findById(tailorId);

    if (!tailor) {
      return res.status(404).json({
        message: "Tailor not found",
      });
    }

    const valid = await bcrypt.compare(currentPassword, tailor.password);

    if (!valid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    tailor.password = await bcrypt.hash(newPassword, 12);

    await tailor.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,

  updateProfile,

  uploadLogo,

  changePassword,
};
