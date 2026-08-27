import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [status, setStatus] = useState("");

  const loadOrders = async () => {
    try {
      const url = status ? `/orders?status=${status}` : "/orders";

      const response = await API.get(url);

      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [status]);

  const deleteOrder = async (id) => {
    const confirmed = window.confirm("Delete this order?");

    if (!confirmed) return;

    try {
      await API.delete(`/orders/${id}`);

      loadOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete order");
    }
  };

  const statusClass = (value) => {
    return value.toLowerCase().replace(" ", "-");
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Orders</h2>

          <p>Manage customer clothing orders.</p>
        </div>

        <Link to="/tailor/orders/new" className="primary-btn">
          + New Order
        </Link>
      </div>

      <div className="panel">
        <div className="toolbar">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Orders</option>

            <option>Pending</option>

            <option>Cutting</option>

            <option>Sewing</option>

            <option>Ready</option>

            <option>Delivered</option>

            <option>Cancelled</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>

                <th>Clothing</th>

                <th>Order Date</th>

                <th>Delivery</th>

                <th>Price</th>

                <th>Paid</th>

                <th>Balance</th>

                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>{order.customer?.name}</strong>

                    <small>{order.customer?.phone}</small>
                  </td>

                  <td>{order.clothingType}</td>

                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>

                  <td>
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{order.price.toFixed(2)}</td>

                  <td>{order.amountPaid.toFixed(2)}</td>

                  <td>
                    <strong>{order.balance.toFixed(2)}</strong>
                  </td>

                  <td>
                    <span className={`badge ${statusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/tailor/orders/${order._id}`}
                      className="action-btn"
                    >
                      View
                    </Link>

                    <Link
                      to={`/tailor/orders/${order._id}/edit`}
                      className="action-btn edit"
                    >
                      Edit
                    </Link>

                    <button
                      className="action-btn delete"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="empty-state">
              <h3>No orders found</h3>

              <p>Create your first customer order.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
