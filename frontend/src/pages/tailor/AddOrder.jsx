import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const AddOrder = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer: "",
    clothingType: "",
    description: "",
    orderDate: new Date().toISOString().split("T")[0],
    deliveryDate: "",
    price: "",
    amountPaid: "",
    status: "Pending",
    notes: "",
  });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await API.get("/customer");

        setCustomers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const price = Number(form.price) || 0;

  const amountPaid = Number(form.amountPaid) || 0;

  const balance = Math.max(0, price - amountPaid);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await API.post("/orders", {
        ...form,
        price,
        amountPaid,
      });

      navigate("/tailor/orders");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>New Order</h2>

          <p>Create a new customer order.</p>
        </div>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <h3>Order Information</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Customer</label>

            <select
              name="customer"
              value={form.customer}
              onChange={handleChange}
              required
            >
              <option value="">Select customer</option>

              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                  {" — "}
                  {customer.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Clothing Type</label>

            <select
              name="clothingType"
              value={form.clothingType}
              onChange={handleChange}
              required
            >
              <option value="">Select clothing</option>

              <option>Kaftan</option>

              <option>Shirt</option>

              <option>Trousers</option>

              <option>Suit</option>

              <option>Dress</option>

              <option>Jumpsuit</option>

              <option>Native Wear</option>

              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Order Date</label>

            <input
              type="date"
              name="orderDate"
              value={form.orderDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Expected Delivery</label>

            <input
              type="date"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Price</label>

            <input
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount Paid</label>

            <input
              type="number"
              min="0"
              step="0.01"
              name="amountPaid"
              value={form.amountPaid}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Balance</label>

            <input value={balance.toFixed(2)} readOnly />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select name="status" value={form.status} onChange={handleChange}>
              <option>Pending</option>

              <option>Cutting</option>

              <option>Sewing</option>

              <option>Ready</option>

              <option>Delivered</option>

              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the design..."
          />
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
            onClick={() => navigate("/tailor/orders")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Order"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default AddOrder;
