import { useEffect, useState } from "react";

import API from "../../services/api";

import Layout from "../../components/Layout";

const TailorDashboard = () => {
  const [customers, setCustomers] = useState([]);

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

  const today = new Date().toISOString().split("T")[0];

  const todayCustomers = customers.filter((customer) =>
    customer.date?.startsWith(today),
  );

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>

          <p>Manage your customers and measurements.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <span>Total Customers</span>

            <h3>{customers.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>

          <div>
            <span>Today's Customers</span>

            <h3>{todayCustomers.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📏</div>

          <div>
            <span>Measurements</span>

            <h3>{customers.length}</h3>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Recent Customers</h3>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>

                <th>Phone</th>

                <th>Date</th>

                <th>Waist</th>

                <th>Leg Length</th>
              </tr>
            </thead>

            <tbody>
              {customers.slice(0, 10).map((customer) => (
                <tr key={customer._id}>
                  <td>
                    <strong>{customer.name}</strong>
                  </td>

                  <td>{customer.phone}</td>

                  <td>{new Date(customer.date).toLocaleDateString()}</td>

                  <td>{customer.measurements?.waist || "-"}</td>

                  <td>{customer.measurements?.legLength || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TailorDashboard;
