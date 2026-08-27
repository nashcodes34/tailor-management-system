import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const EditCustomer = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",

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

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const response = await API.get(`/customer/${id}`);

        const customer = response.data;

        const m = customer.measurements || {};

        setForm({
          name: customer.name || "",

          phone: customer.phone || "",

          date: customer.date ? customer.date.split("T")[0] : "",

          neck: m.neck || "",
          chest: m.chest || "",
          shoulder: m.shoulder || "",
          armLength: m.armLength || "",
          sleeve: m.sleeve || "",
          waist: m.waist || "",
          hip: m.hip || "",
          thigh: m.thigh || "",
          knee: m.knee || "",
          legLength: m.legLength || "",
          inseam: m.inseam || "",
          shirtLength: m.shirtLength || "",
          trouserLength: m.trouserLength || "",

          notes: m.notes || "",
        });
      } catch (error) {
        alert("Unable to load customer");

        navigate("/tailor/customers");
      }
    };

    loadCustomer();
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
      await API.put(`/customer/${id}`, form);

      navigate(`/tailor/customers/${id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update customer");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
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
          <h2>Edit Customer</h2>

          <p>Update customer measurements.</p>
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
          {fields.map(([name, label]) => (
            <div className="form-group" key={name}>
              <label>{label}</label>

              <input
                type="number"
                step="0.1"
                name={name}
                value={form[name]}
                onChange={handleChange}
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
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate(`/tailor/customers/${id}`)}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default EditCustomer;
