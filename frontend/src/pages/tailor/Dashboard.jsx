import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

import { formatCurrency } from "../../utils/currency";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await API.get("/dashboard/tailor");

        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="panel">Loading dashboard...</div>
      </Layout>
    );
  }

  const { statistics, recentOrders } = data;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Tailor Dashboard</h2>

          <p>Overview of your tailoring business.</p>
        </div>
      </div>

      {/* MAIN STATISTICS */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <span>Customers</span>

            <strong>{statistics.totalCustomers}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🧵</div>

          <div>
            <span>Total Orders</span>

            <strong>{statistics.totalOrders}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>

          <div>
            <span>Pending</span>

            <strong>{statistics.pendingOrders}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>

          <div>
            <span>Outstanding</span>

            <strong>{formatCurrency(statistics.outstandingBalance)}</strong>
          </div>
        </div>
      </div>

      {/* REVENUE */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💵</div>

          <div>
            <span>Amount Collected</span>

            <strong>{formatCurrency(statistics.totalRevenue)}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>

          <div>
            <span>Total Order Value</span>

            <strong>{formatCurrency(statistics.totalOrderValue)}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✂️</div>

          <div>
            <span>Cutting</span>

            <strong>{statistics.cuttingOrders}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🪡</div>

          <div>
            <span>Sewing</span>

            <strong>{statistics.sewingOrders}</strong>
          </div>
        </div>
      </div>

      {/* ORDER STATUS */}

      <div className="panel">
        <div className="section-header">
          <h3>Order Status</h3>

          <Link to="/tailor/orders" className="text-link">
            View All
          </Link>
        </div>

        <div className="status-grid">
          <div>
            <span>Pending</span>

            <strong>{statistics.pendingOrders}</strong>
          </div>

          <div>
            <span>Cutting</span>

            <strong>{statistics.cuttingOrders}</strong>
          </div>

          <div>
            <span>Sewing</span>

            <strong>{statistics.sewingOrders}</strong>
          </div>

          <div>
            <span>Ready</span>

            <strong>{statistics.readyOrders}</strong>
          </div>

          <div>
            <span>Delivered</span>

            <strong>{statistics.deliveredOrders}</strong>
          </div>

          <div>
            <span>Cancelled</span>

            <strong>{statistics.cancelledOrders}</strong>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}

      <div className="panel">
        <div className="section-header">
          <h3>Recent Orders</h3>

          <Link to="/tailor/orders" className="text-link">
            View All
          </Link>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>

                <th>Clothing</th>

                <th>Status</th>

                <th>Amount</th>

                <th>Balance</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customer?.name}</td>

                  <td>{order.clothingType}</td>

                  <td>
                    <span
                      className={`badge ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>{formatCurrency(order.price)}</td>

                  <td>{formatCurrency(order.balance)}</td>

                  <td>
                    <Link
                      to={`/tailor/orders/${order._id}`}
                      className="action-btn"
                    >
                      View
                    </Link>
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

export default Dashboard;
