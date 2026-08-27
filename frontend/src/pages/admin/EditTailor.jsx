import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const AddTailor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shopName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [logo, setLogo] = useState(null);

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
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      if (logo) {
        data.append("logo", logo);
      }

      await API.post("/admin/tailors", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/tailors");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to create tailor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Add Tailor Master</h2>

          <p>Register a new tailoring shop.</p>
        </div>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Shop Name</label>

            <input
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>

            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address</label>

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Shop Logo</label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setLogo(e.target.files[0])}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/admin/tailors")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Tailor"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default AddTailor;
