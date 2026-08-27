const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Tailor = require("../models/Tailor");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// ADMIN LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",

      token: generateToken(admin),

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE TAILOR
const createTailor = async (req, res) => {
  try {
    const { shopName, email, password, phone, address } = req.body;

    const existingTailor = await Tailor.findOne({ email });

    if (existingTailor) {
      return res.status(400).json({
        message: "A tailor with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const tailor = await Tailor.create({
      shopName,

      email,

      password: hashedPassword,

      phone,

      address,

      active: true,

      role: "tailor",

      logo: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({
      message: "Tailor Master created successfully",

      tailor: {
        id: tailor._id,
        shopName: tailor.shopName,
        email: tailor.email,
        phone: tailor.phone,
        address: tailor.address,
        logo: tailor.logo,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL TAILORS
const getTailors = async (req, res) => {
  try {
    const tailors = await Tailor.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(tailors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE TAILOR
const getTailor = async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id).select("-password");

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

// DELETE TAILOR
const deleteTailor = async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id);

    if (!tailor) {
      return res.status(404).json({
        message: "Tailor not found",
      });
    }

    await tailor.deleteOne();

    res.json({
      message: "Tailor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TAILOR
const updateTailor = async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id);

    if (!tailor) {
      return res.status(404).json({
        message: "Tailor not found",
      });
    }

    const { shopName, email, password, phone, address, isActive, active } =
      req.body;

    // Check if another tailor already uses the email
    if (email && email !== tailor.email) {
      const existing = await Tailor.findOne({
        email,
        _id: { $ne: tailor._id },
      });

      if (existing) {
        return res.status(400).json({
          message: "Email is already being used",
        });
      }

      tailor.email = email;
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

    const shouldSetActive = isActive !== undefined ? isActive : active;

    if (shouldSetActive !== undefined) {
      const nextActive = shouldSetActive === true || shouldSetActive === "true";
      tailor.active = nextActive;
      tailor.isActive = nextActive;
    }

    // Only change password if one was supplied
    if (password && password.trim() !== "") {
      tailor.password = await bcrypt.hash(password, 12);
    }

    // Replace logo if uploaded
    if (req.file) {
      tailor.logo = `/uploads/${req.file.filename}`;
    }

    await tailor.save();

    res.json({
      message: "Tailor updated successfully",

      tailor: {
        id: tailor._id,
        shopName: tailor.shopName,
        email: tailor.email,
        phone: tailor.phone,
        address: tailor.address,
        logo: tailor.logo,
        active: tailor.active,
        isActive: tailor.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
  createTailor,
  getTailors,
  getTailor,
  updateTailor,
  deleteTailor,
};
