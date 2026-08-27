const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

const tailorOnly = (req, res, next) => {
  if (req.user.role !== "tailor") {
    return res.status(403).json({
      message: "Tailor Master access required",
    });
  }

  if (
    req.user.subscriptionExpiresAt &&
    new Date(req.user.subscriptionExpiresAt) <= new Date()
  ) {
    return res.status(403).json({
      message: "Your monthly access has ended. Please renew your subscription.",
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
  tailorOnly,
};
