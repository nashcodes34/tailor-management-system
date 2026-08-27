const crypto = require("crypto");

const Tailor = require("../models/Tailor");
const Subscription = require("../models/Subscription");

const paystackRequest = async (path, options = {}) => {
  const response = await fetch(`https://api.paystack.co${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  if (!response.ok || !data.status)
    throw new Error(data.message || "Paystack request failed");
  return data.data;
};

const getNextMonthStart = () => {
  const nextMonth = new Date();
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1, 1);
  nextMonth.setUTCHours(0, 0, 0, 0);
  return nextMonth;
};

const activateSubscription = async (payment) => {
  const subscription = await Subscription.findOne({
    reference: payment.reference,
  });
  if (!subscription || subscription.status === "success") return subscription;

  const expectedAmount = Number(process.env.PAYSTACK_MONTHLY_AMOUNT);
  if (
    payment.status !== "success" ||
    payment.amount !== expectedAmount ||
    payment.currency !== subscription.currency
  ) {
    subscription.status = "failed";
    await subscription.save();
    return subscription;
  }

  subscription.status = "success";
  subscription.paidAt = new Date();
  subscription.expiresAt = getNextMonthStart();
  await subscription.save();
  await Tailor.findByIdAndUpdate(subscription.tailor, {
    active: true,
    subscriptionExpiresAt: subscription.expiresAt,
  });
  return subscription;
};

const initializeSubscription = async (req, res) => {
  try {
    const { email } = req.body;
    const amount = Number(process.env.PAYSTACK_MONTHLY_AMOUNT);
    const missingConfiguration = [
      !process.env.PAYSTACK_SECRET_KEY && "PAYSTACK_SECRET_KEY",
      (!amount || amount < 1) && "PAYSTACK_MONTHLY_AMOUNT",
    ].filter(Boolean);

    if (missingConfiguration.length) {
      return res.status(500).json({
        message: `Payment configuration is incomplete: ${missingConfiguration.join(", ")}`,
      });
    }

    const tailor = await Tailor.findOne({ email: email?.toLowerCase() });
    if (!tailor)
      return res
        .status(404)
        .json({ message: "No tailor account matches that email" });

    const payment = await paystackRequest("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: tailor.email,
        amount,
        currency: "GHS",
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: {
          tailorId: tailor._id.toString(),
          purpose: "monthly_reactivation",
        },
      }),
    });

    await Subscription.create({
      tailor: tailor._id,
      reference: payment.reference,
      amount,
      currency: "GHS",
    });
    res.json({ authorizationUrl: payment.authorization_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifySubscription = async (req, res) => {
  try {
    const payment = await paystackRequest(
      `/transaction/verify/${encodeURIComponent(req.params.reference)}`,
    );
    const subscription = await activateSubscription(payment);
    if (!subscription || subscription.status !== "success") {
      return res
        .status(400)
        .json({ message: "Payment has not been completed" });
    }
    res.json({ message: "Payment successful. You can now sign in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleWebhook = async (req, res) => {
  const signature = req.headers["x-paystack-signature"];
  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest("hex");
  if (!signature || signature !== expected)
    return res.status(401).json({ message: "Invalid webhook signature" });

  try {
    if (req.body?.event === "charge.success")
      await activateSubscription(req.body.data);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { initializeSubscription, verifySubscription, handleWebhook };
