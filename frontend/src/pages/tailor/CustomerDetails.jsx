import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const CustomerDetails = () => {
  const { id } = useParams();

  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customerResponse, ordersResponse] = await Promise.all([
          API.get(`/customer/${id}`),
          API.get(`/orders?customer=${id}`),
        ]);

        setCustomer(customerResponse.data);
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [id]);

  if (!customer) {
    return (
      <Layout>
        <div className="panel">Loading customer...</div>
      </Layout>
    );
  }

  const measurements = customer.measurements || {};

  const customerDate = customer.date ? new Date(customer.date) : null;

  const measurementRows = [
    ["Neck", measurements.neck],

    ["Chest", measurements.chest],

    ["Shoulder", measurements.shoulder],

    ["Arm Length", measurements.armLength],

    ["Sleeve", measurements.sleeve],

    ["Waist", measurements.waist],

    ["Hip", measurements.hip],

    ["Thigh", measurements.thigh],

    ["Knee", measurements.knee],

    ["Leg Length", measurements.legLength],

    ["Inseam", measurements.inseam],

    ["Shirt Length", measurements.shirtLength],

    ["Trouser Length", measurements.trouserLength],
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Customer Details</h2>

          <p>Complete customer measurement record.</p>
        </div>

        <div>
          <Link to={`/tailor/customers/${id}/edit`} className="primary-btn">
            Edit Measurements
          </Link>{" "}
          <Link
            to={`/tailor/customers/${customer._id}/measurements/new`}
            className="primary-btn"
          >
            + New Measurement
          </Link>
          <button className="secondary-btn" onClick={() => window.print()}>
            🖨 Print
          </button>
        </div>
      </div>

      <div className="customer-profile panel">
        <h3>Customer Information</h3>

        <div className="customer-info-grid">
          <div>
            <span>Name</span>

            <strong>{customer.name}</strong>
          </div>

          <div>
            <span>Phone</span>

            <strong>{customer.phone}</strong>
          </div>

          <div>
            <span>Date</span>

            <strong>
              {customerDate && !Number.isNaN(customerDate.getTime())
                ? customerDate.toLocaleDateString()
                : "-"}
            </strong>
          </div>
        </div>
      </div>

      <div className="panel measurement-card">
        <h3>Body Measurements</h3>

        <div className="measurement-display">
          {measurementRows.map(([label, value]) => (
            <div className="measurement-item" key={label}>
              <span>{label}</span>

              <strong>{value || "-"}</strong>
            </div>
          ))}
        </div>

        {measurements.notes && (
          <div className="notes-box">
            <strong>Notes</strong>

            <p>{measurements.notes}</p>
          </div>
        )}

        <div className="panel">
          <div className="section-header">
            <h3>Order History</h3>

            <Link to="/tailor/orders/new" className="primary-btn">
              + New Order
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <h3>No orders yet</h3>

              <p>This customer has no orders.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Clothing</th>

                    <th>Order Date</th>

                    <th>Delivery</th>

                    <th>Price</th>

                    <th>Balance</th>

                    <th>Status</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.clothingType}</td>

                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>

                      <td>
                        {order.deliveryDate
                          ? new Date(order.deliveryDate).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        GH₵
                        {order.price.toFixed(2)}
                      </td>

                      <td>
                        GH₵
                        {order.balance.toFixed(2)}
                      </td>

                      <td>
                        <span
                          className={`badge ${order.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDetails;
