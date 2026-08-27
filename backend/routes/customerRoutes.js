const express = require("express");

const router = express.Router();

const {
  createCustomer,

  getCustomers,

  getCustomer,

  updateCustomer,

  deleteCustomer,
} = require("../controllers/customerController");

const {
  protect,

  tailorOnly,
} = require("../middleware/auth");

// CREATE
router.post(
  "/",

  protect,

  tailorOnly,

  createCustomer,
);

// GET ALL
router.get(
  "/",

  protect,

  tailorOnly,

  getCustomers,
);

// GET ONE
router.get(
  "/:id",

  protect,

  tailorOnly,

  getCustomer,
);

// UPDATE
router.put(
  "/:id",

  protect,

  tailorOnly,

  updateCustomer,
);

// DELETE
router.delete(
  "/:id",

  protect,

  tailorOnly,

  deleteCustomer,
);

module.exports = router;
