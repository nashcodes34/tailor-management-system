import { useState } from "react";

import API from "../services/api";

const AddPayment = ({ order, onPaymentAdded }) => {
  const [form, setForm] = useState({
    amount: "",
    paymentMethod: "Cash",
    paymentDate: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitPayment = async (e) => {
    e.preventDefault();

    const amount = Number(form.amount);

    if (amount <= 0) {
      alert("Enter a valid payment amount");

      return;
    }

    if (amount > order.balance) {
      alert("Payment cannot exceed the outstanding balance");

      return;
    }

    setLoading(true);

    try {
      await API.post("/payments", {
        order: order._id,
        ...form,
        amount,
      });

      setForm({
        amount: "",

        paymentMethod: "Cash",

        paymentDate: new Date().toISOString().split("T")[0],

        reference: "",

        notes: "",
      });

      if (onPaymentAdded) {
        onPaymentAdded();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Unable to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payment-form" onSubmit={submitPayment}>
      <h3>Record Payment</h3>

      <div className="payment-balance">
        Outstanding Balance:
        <strong>
          GH₵
          {Number(order.balance).toFixed(2)}
        </strong>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Amount</label>

          <input
            type="number"
            name="amount"
            min="0.01"
            max={order.balance}
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Method</label>

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option>Cash</option>

            <option>Mobile Money</option>

            <option>Bank Transfer</option>

            <option>Card</option>

            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Payment Date</label>

          <input
            type="date"
            name="paymentDate"
            value={form.paymentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Reference</label>

          <input
            type="text"
            name="reference"
            placeholder="Transaction reference"
            value={form.reference}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Notes</label>

        <textarea
          name="notes"
          rows="2"
          value={form.notes}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="primary-btn" disabled={loading}>
        {loading ? "Recording..." : "Record Payment"}
      </button>
    </form>
  );
};

export default AddPayment;
