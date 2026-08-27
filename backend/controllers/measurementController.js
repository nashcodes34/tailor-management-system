const Measurement = require("../models/Measurement");

const Customer = require("../models/Customer");

const MeasurementTemplate = require("../models/MeasurementTemplate");

const getTailorId = (req) => req.user?.id || req.user?._id;

// GET TEMPLATES
const getTemplates = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const templates = await MeasurementTemplate.find({
      tailor: tailorId,
      active: true,
    }).sort({
      name: 1,
    });

    res.json(templates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE MEASUREMENT
const createMeasurement = async (req, res) => {
  try {
    const tailorId = getTailorId(req);
    const { customer, template, unit, values, notes, measuredAt } = req.body;

    const customerRecord = await Customer.findOne({
      _id: customer,
      tailor: tailorId,
    });

    if (!customerRecord) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const templateRecord = await MeasurementTemplate.findOne({
      _id: template,
      tailor: tailorId,
      active: true,
    });

    if (!templateRecord) {
      return res.status(404).json({
        message: "Measurement template not found",
      });
    }

    // Validate required fields
    for (const field of templateRecord.fields) {
      if (
        field.required &&
        (values?.[field.name] === undefined || values?.[field.name] === "")
      ) {
        return res.status(400).json({
          message: `${field.label} is required`,
        });
      }
    }

    const measurement = await Measurement.create({
      tailor: tailorId,

      customer: customerRecord._id,

      template: templateRecord._id,

      garmentName: templateRecord.name,

      unit: unit || "inch",

      values: values || {},

      notes,

      measuredAt,
    });

    const populated = await Measurement.findById(measurement._id)
      .populate("customer", "name phone")
      .populate("template");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET CUSTOMER MEASUREMENTS
const getCustomerMeasurements = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const customer = await Customer.findOne({
      _id: req.params.customerId,
      tailor: tailorId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const measurements = await Measurement.find({
      customer: customer._id,
      tailor: tailorId,
    })
      .populate("template")
      .sort({
        measuredAt: -1,
      });

    res.json(measurements);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE MEASUREMENT
const getMeasurement = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const measurement = await Measurement.findOne({
      _id: req.params.id,
      tailor: tailorId,
    })
      .populate("customer", "name phone")
      .populate("template");

    if (!measurement) {
      return res.status(404).json({
        message: "Measurement not found",
      });
    }

    res.json(measurement);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE MEASUREMENT
const deleteMeasurement = async (req, res) => {
  try {
    const tailorId = getTailorId(req);

    const measurement = await Measurement.findOne({
      _id: req.params.id,
      tailor: tailorId,
    });

    if (!measurement) {
      return res.status(404).json({
        message: "Measurement not found",
      });
    }

    await measurement.deleteOne();

    res.json({
      message: "Measurement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTemplates,

  createMeasurement,

  getCustomerMeasurements,

  getMeasurement,

  deleteMeasurement,
};
