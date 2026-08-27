require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

const connectDB = require("./config/db");

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");

      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123123", 12);

    await Admin.create({
      name: "System Administrator",

      email: "admin@gmail.com",

      password: hashedPassword,

      role: "admin",
    });

    console.log("Admin created successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

createAdmin();
