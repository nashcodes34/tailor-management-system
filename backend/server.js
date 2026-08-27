require("dotenv").config();

const express = require("express");

const path = require("path");

const cors = require("cors");

const helmet = require("helmet");

const morgan = require("morgan");

const connectDB = require("./config/db");

const app = express();

const { handleWebhook } = require("./controllers/subscriptionController");

const orderRoutes = require("./routes/orderRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const paymentRoutes = require("./routes/paymentRoutes");

const tailorProfileRoutes = require("./routes/tailorProfileRoutes");

const measurementRoutes = require("./routes/measurementRoutes");

connectDB();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.post(
  "/api/subscriptions/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    try {
      req.rawBody = req.body;
      req.body = JSON.parse(req.body.toString("utf8"));
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid webhook body" });
    }
  },
  handleWebhook,
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/tailor", require("./routes/tailorRoutes"));

app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));

app.use("/api/orders", orderRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/customer", require("./routes/customerRoutes"));

app.use("/api/payments", paymentRoutes);

app.use("/api/measurements", measurementRoutes);

app.use("/api/tailor/profile", tailorProfileRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT, () => {
  console.log(`Server Running on ${process.env.PORT}`);
});
