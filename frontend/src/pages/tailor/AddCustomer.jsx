import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const AddCustomer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],

    neck: "",
    chest: "",
    shoulder: "",
    armLength: "",
    sleeve: "",
    waist: "",
    hip: "",
    thigh: "",
    knee: "",
    legLength: "",
    inseam: "",
    shirtLength: "",
    trouserLength: "",

    notes: "",
  });

  const [loading, setLoading] = useState(false);

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
      await API.post("/customer", form);

      navigate("/tailor/customers");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to create customer");
    } finally {
      setLoading(false);
    }
  };

  const measurementFields = [
    ["neck", "Neck"],

    ["chest", "Chest"],

    ["shoulder", "Shoulder"],

    ["armLength", "Arm Length"],

    ["sleeve", "Sleeve"],

    ["waist", "Waist"],

    ["hip", "Hip"],

    ["thigh", "Thigh"],

    ["knee", "Knee"],

    ["legLength", "Leg Length"],

    ["inseam", "Inseam"],

    ["shirtLength", "Shirt Length"],

    ["trouserLength", "Trouser Length"],
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Add Customer</h2>

          <p>Enter customer information and measurements.</p>
        </div>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <h3>Customer Information</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Customer Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <h3 className="section-title">Measurements</h3>

        <div className="measurement-grid">
          {measurementFields.map(([name, label]) => (
            <div className="form-group" key={name}>
              <label>{label}</label>

              <input
                type="number"
                step="0.1"
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Notes</label>

          <textarea
            name="notes"
            rows="4"
            value={form.notes}
            onChange={handleChange}
            placeholder="Additional instructions..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/tailor/customers")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Customer"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default AddCustomer;
