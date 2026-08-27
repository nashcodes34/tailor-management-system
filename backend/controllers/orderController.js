const Order = require("../models/Order");
const Customer = require("../models/Customer");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      clothingType,
      description,
      orderDate,
      deliveryDate,
      price,
      amountPaid,
      status,
      notes,
    } = req.body;

    // Make sure customer belongs to logged-in tailor
    const customerRecord = await Customer.findOne({
      _id: customer,
      tailor: req.user.id,
    });

    if (!customerRecord) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const order = await Order.create({
      tailor: req.user.id,
      customer,
      clothingType,
      description,
      orderDate,
      deliveryDate,
      price,
      amountPaid,
      status,
      notes,
    });

    const populatedOrder = await Order.findById(order._id).populate(
      "customer",
      "name phone",
    );

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL ORDERS
const getOrders = async (req, res) => {
  try {
    const { status, customer } = req.query;

    const filter = {
      tailor: req.user.id,
    };

    if (status) {
      filter.status = status;
    }

    if (customer) {
      filter.customer = customer;
    }

    const orders = await Order.find(filter)
      .populate("customer", "name phone")
      .sort({
        createdAt: -1,
      });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE ORDER
const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      tailor: req.user.id,
    }).populate("customer", "name phone date measurements");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE ORDER
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      tailor: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const fields = [
      "customer",
      "clothingType",
      "description",
      "orderDate",
      "deliveryDate",
      "price",
      "amountPaid",
      "status",
      "notes",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        order[field] = req.body[field];
      }
    });

    // If changing customer, verify ownership
    if (req.body.customer) {
      const customer = await Customer.findOne({
        _id: req.body.customer,
        tailor: req.user.id,
      });

      if (!customer) {
        return res.status(404).json({
          message: "Customer does not belong to this tailor",
        });
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id).populate(
      "customer",
      "name phone",
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      tailor: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
