import { useState } from "react";

import API from "../../services/api";

import Layout from "../../components/Layout";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");

      return;
    }

    try {
      await API.put("/tailor/profile/password", {
        currentPassword: form.currentPassword,

        newPassword: form.newPassword,
      });

      alert("Password changed successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Unable to change password");
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Change Password</h2>
        </div>
      </div>

      <form className="form-panel password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>

          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>

          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>

        <button type="submit" className="primary-btn">
          Change Password
        </button>
      </form>
    </Layout>
  );
};

export default ChangePassword;
