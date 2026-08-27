import { useEffect, useState } from "react";

import API from "../../services/api";

import Layout from "../../components/Layout";

const ShopProfile = () => {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    shopName: "",
    phone: "",
    address: "",
    description: "",
    currency: "GHS",
  });

  const [logo, setLogo] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await API.get("/tailor/profile");

      setProfile(response.data);

      setForm({
        shopName: response.data.shopName || "",

        phone: response.data.phone || "",

        address: response.data.address || "",

        description: response.data.description || "",

        currency: response.data.currency || "GHS",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await API.put("/tailor/profile", form);

      setProfile(response.data);

      alert("Shop profile updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update profile");
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async () => {
    if (!logo) {
      alert("Please select a logo");

      return;
    }

    const data = new FormData();

    data.append("logo", logo);

    try {
      const response = await API.put("/tailor/profile/logo", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile({
        ...profile,
        logo: response.data.logo,
      });

      setLogo(null);

      alert("Logo uploaded successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to upload logo");
    }
  };

  if (!profile) {
    return (
      <Layout>
        <div className="panel">Loading profile...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Shop Profile</h2>

          <p>Manage your tailoring shop information.</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="panel">
          <h3>Shop Logo</h3>

          <div className="logo-preview">
            {profile.logo ? (
              <img src={profile.logo} alt="Shop logo" />
            ) : (
              <div className="logo-placeholder">
                {profile.shopName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => setLogo(e.target.files[0])}
          />

          <button className="primary-btn" onClick={uploadLogo}>
            Upload Logo
          </button>
        </div>

        <form className="form-panel" onSubmit={saveProfile}>
          <h3>Shop Information</h3>

          <div className="form-group">
            <label>Shop Name</label>

            <input
              type="text"
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input type="email" value={profile.email} disabled />

            <small>Contact the administrator to change your login email.</small>
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Shop Description</label>

            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell customers about your shop..."
            />
          </div>

          <div className="form-group">
            <label>Currency</label>

            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
            >
              <option value="GHS">Ghana Cedi (GH₵)</option>

              <option value="USD">US Dollar ($)</option>

              <option value="NGN">Nigerian Naira (₦)</option>
            </select>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ShopProfile;
