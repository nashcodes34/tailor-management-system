import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const EditOrder = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer: "",
    clothingType: "",
    description: "",
    orderDate: "",
    deliveryDate: "",
    price: "",
    amountPaid: "",
    status: "Pending",
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orderResponse, customerResponse] = await Promise.all([
          API.get(`/orders/${id}`),

          API.get("/customer"),
        ]);

        const order = orderResponse.data;

        setCustomers(customerResponse.data);

        setForm({
          customer: order.customer?._id || "",

          clothingType: order.clothingType || "",

          description: order.description || "",

          orderDate: order.orderDate ? order.orderDate.split("T")[0] : "",

          deliveryDate: order.deliveryDate
            ? order.deliveryDate.split("T")[0]
            : "",

          price: order.price || "",

          status: order.status || "Pending",

          notes: order.notes || "",
        });
      } catch (error) {
        console.error(error);

        alert("Unable to load order");

        navigate("/tailor/orders");
      }
    };

    loadData();
  }, [id, navigate]);

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
      await API.put(`/orders/${id}`, {
        ...form,
        price,
        amountPaid,
      });

      navigate(`/tailor/orders/${id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Edit Order</h2>

          <p>Update order information.</p>
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
            <label>Delivery Date</label>

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
              name="amountPaid"
              value={form.amountPaid}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Current Balance</label>

            <input value={`GH₵${balance.toFixed(2)}`} readOnly />
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
            rows="4"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>

          <textarea
            name="notes"
            rows="4"
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default EditOrder;
