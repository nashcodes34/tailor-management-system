const Customer = require("../models/Customer");

const getTailorId = (req) => req.user?.id || req.user?._id;

// CREATE CUSTOMER
const createCustomer = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const {
      name,
      phone,
      date,

      neck,
      chest,
      shoulder,
      armLength,
      sleeve,
      waist,
      hip,
      thigh,
      knee,
      legLength,
      inseam,
      shirtLength,
      trouserLength,

      notes,
    } = req.body;

    const customer = await Customer.create({
      tailor: tailorId,

      name,

      phone,

      date: date || new Date(),

      measurements: {
        neck,
        chest,
        shoulder,
        armLength,
        sleeve,
        waist,
        hip,
        thigh,
        knee,
        legLength,
        inseam,
        shirtLength,
        trouserLength,

        notes,
      },
    });

    res.status(201).json({
      message: "Customer created successfully",

      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const customers = await Customer.find({
      tailor: tailorId,
    }).sort({
      createdAt: -1,
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE CUSTOMER
const getCustomer = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const customer = await Customer.findOne({
      _id: req.params.id,

      tailor: tailorId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE CUSTOMER
const updateCustomer = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const customer = await Customer.findOne({
      _id: req.params.id,

      tailor: tailorId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const {
      name,
      phone,
      date,

      neck,
      chest,
      shoulder,
      armLength,
      sleeve,
      waist,
      hip,
      thigh,
      knee,
      legLength,
      inseam,
      shirtLength,
      trouserLength,

      notes,
    } = req.body;

    customer.name = name;
    customer.phone = phone;
    customer.date = date;

    customer.measurements = {
      neck,
      chest,
      shoulder,
      armLength,
      sleeve,
      waist,
      hip,
      thigh,
      knee,
      legLength,
      inseam,
      shirtLength,
      trouserLength,

      notes,
    };

    await customer.save();

    res.json({
      message: "Customer updated successfully",

      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const customer = await Customer.findOne({
      _id: req.params.id,

      tailor: tailorId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    await customer.deleteOne();

    res.json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createCustomer,

  getCustomers,

  getCustomer,

  updateCustomer,

  deleteCustomer,
};
