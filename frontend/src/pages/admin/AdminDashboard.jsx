import { useEffect, useState } from "react";

import API from "../../services/api";

import Layout from "../../components/Layout";

const AdminDashboard = () => {
  const [tailors, setTailors] = useState([]);

  useEffect(() => {
    const loadTailors = async () => {
      try {
        const response = await API.get("/admin/tailors");

        setTailors(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadTailors();
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>

          <p>Overview of your tailoring business system.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✂</div>

          <div>
            <span>Total Tailors</span>

            <h3>{tailors.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>

          <div>
            <span>Active Tailors</span>

            <h3>{tailors.filter((tailor) => tailor.active).length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏪</div>

          <div>
            <span>Shops</span>

            <h3>{tailors.length}</h3>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Recent Tailor Masters</h3>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Shop</th>

                <th>Email</th>

                <th>Phone</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {tailors.slice(0, 5).map((tailor) => (
                <tr key={tailor._id}>
                  <td>
                    <strong>{tailor.shopName}</strong>
                  </td>

                  <td>{tailor.email}</td>

                  <td>{tailor.phone || "-"}</td>

                  <td>
                    <span
                      className={
                        tailor.active ? "badge success" : "badge danger"
                      }
                    >
                      {tailor.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
