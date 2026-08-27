import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

import { formatCurrency } from "../../utils/currency";

const AddPayment = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    amount: "",
    paymentMethod: "Cash",
    reference: "",
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setError("");
        const response = await API.get(`/orders/${id}`);

        setOrder(response.data);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Unable to load this order. Please try again.",
        );
        setOrder(null);
      }
    };

    loadOrder();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await API.post("/payments", {
        order: id,
        ...form,
        amount: Number(form.amount),
      });

      navigate(`/tailor/payments/${response.data._id}/receipt`);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to record payment");
    } finally {
      setLoading(false);
    }
  };

  if (!order && !error) {
    return (
      <Layout>
        <div className="panel">Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="panel">
          <h3>Unable to load order</h3>
          <p>{error}</p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate("/tailor/orders")}
          >
            Back to Orders
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Record Payment</h2>

          <p>Record a payment for this order.</p>
        </div>
      </div>

      <div className="panel">
        <h3>Order Summary</h3>

        <div className="customer-info-grid">
          <div>
            <span>Customer</span>

            <strong>{order.customer?.name}</strong>
          </div>

          <div>
            <span>Clothing</span>

            <strong>{order.clothingType}</strong>
          </div>

          <div>
            <span>Order Total</span>

            <strong>{formatCurrency(order.price)}</strong>
          </div>

          <div>
            <span>Already Paid</span>

            <strong>{formatCurrency(order.amountPaid)}</strong>
          </div>

          <div>
            <span>Balance</span>

            <strong>{formatCurrency(order.balance)}</strong>
          </div>
        </div>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <h3>Payment Details</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Amount</label>

            <input
              type="number"
              min="0.01"
              max={order.balance}
              step="0.01"
              name="amount"
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
              value={form.reference}
              onChange={handleChange}
              placeholder="Optional transaction reference"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>

          <textarea
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate(`/tailor/orders/${id}`)}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "Record Payment"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default AddPayment;
