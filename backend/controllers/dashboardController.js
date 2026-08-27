const Customer = require("../models/Customer");
const Order = require("../models/Order");

const getTailorDashboard = async (req, res) => {
  try {
    const tailorId = req.user._id;

    const totalCustomers = await Customer.countDocuments({
      tailor: tailorId,
    });

    const totalOrders = await Order.countDocuments({
      tailor: tailorId,
    });

    const pendingOrders = await Order.countDocuments({
      tailor: tailorId,
      status: "Pending",
    });

    const cuttingOrders = await Order.countDocuments({
      tailor: tailorId,
      status: "Cutting",
    });

    const sewingOrders = await Order.countDocuments({
      tailor: tailorId,
      status: "Sewing",
    });

    const readyOrders = await Order.countDocuments({
      tailor: tailorId,
      status: "Ready",
    });

    const deliveredOrders = await Order.countDocuments({
      tailor: tailorId,
      status: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      tailor: tailorId,
      status: "Cancelled",
    });

    const revenueResult = await Order.aggregate([
      {
        $match: {
          tailor: tailorId,
        },
      },

      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$amountPaid",
          },

          outstandingBalance: {
            $sum: "$balance",
          },

          totalOrderValue: {
            $sum: "$price",
          },
        },
      },
    ]);

    const revenue = revenueResult[0] || {
      totalRevenue: 0,
      outstandingBalance: 0,
      totalOrderValue: 0,
    };

    const recentOrders = await Order.find({
      tailor: tailorId,
    })
      .populate("customer", "name phone")
      .sort({
        createdAt: -1,
      })
      .limit(10);

    res.json({
      statistics: {
        totalCustomers,

        totalOrders,

        pendingOrders,

        cuttingOrders,

        sewingOrders,

        readyOrders,

        deliveredOrders,

        cancelledOrders,

        totalRevenue: revenue.totalRevenue,

        outstandingBalance: revenue.outstandingBalance,

        totalOrderValue: revenue.totalOrderValue,
      },

      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTailorDashboard,
};
