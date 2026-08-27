import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import API from "../../services/api";

import AddPayment from "../../components/AddPayment";

import PaymentHistory from "../../components/PaymentHistory";

import Layout from "../../components/Layout";

import { formatCurrency } from "../../utils/currency";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [paymentRefresh, setPaymentRefresh] = useState(0);

  const [payments, setPayments] = useState([]);

  const [error, setError] = useState("");

  // useEffect(() => {
  //   const loadOrder = async () => {
  //     try {
  //       const response = await API.get(`/orders/${id}`);

  //       setOrder(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   loadOrder();
  // }, [id]);

  // if (!order) {
  //   return (
  //     <Layout>
  //       <div className="panel">Loading order...</div>
  //     </Layout>
  //   );
  // }

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("");

        const [orderResponse, paymentsResponse] = await Promise.all([
          API.get(`/orders/${id}`),

          API.get(`/payments/order/${id}`),
        ]);

        setOrder(orderResponse.data);

        setPayments(paymentsResponse.data);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Unable to load this order. Please try again.",
        );
        setOrder(null);
      }
    };

    loadData();
  }, [id]);

  if (!order && !error) {
    return (
      <Layout>
        <div className="panel">Loading order...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="panel">
          <h3>Unable to load order</h3>
          <p>{error}</p>
          <Link to="/tailor/orders" className="primary-btn">
            Back to Orders
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Order Details</h2>

          <p>Order #{order._id.slice(-8)}</p>

          <AddPayment
            order={order}
            onPaymentAdded={() => {
              setPaymentRefresh((value) => value + 1);

              // Reload order
              window.location.reload();
            }}
          />

          <PaymentHistory order={order} refreshKey={paymentRefresh} />
        </div>

        <div>
          {order.balance > 0 && (
            <Link
              to={`/tailor/orders/${order._id}/payment`}
              className="primary-btn"
            >
              + Record Payment
            </Link>
          )}
          <Link to={`/tailor/orders/${id}/edit`} className="primary-btn">
            Edit Order
          </Link>{" "}
          <button className="secondary-btn" onClick={() => window.print()}>
            🖨 Print
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="section-header">
          <h3>Payment History</h3>

          {order.balance > 0 && (
            <Link
              to={`/tailor/orders/${order._id}/payment`}
              className="primary-btn"
            >
              + Payment
            </Link>
          )}
        </div>

        {payments.length === 0 ? (
          <div className="empty-state">
            <p>No payments recorded yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Receipt</th>

                  <th>Date</th>

                  <th>Amount</th>

                  <th>Method</th>

                  <th>Reference</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.receiptNumber}</td>

                    <td>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>

                    <td>{formatCurrency(payment.amount)}</td>

                    <td>{payment.paymentMethod}</td>

                    <td>{payment.reference || "-"}</td>

                    <td>
                      <Link
                        to={`/tailor/payments/${payment._id}/receipt`}
                        className="action-btn"
                      >
                        Receipt
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h3>Customer</h3>

        <div className="customer-info-grid">
          <div>
            <span>Name</span>

            <strong>{order.customer?.name}</strong>
          </div>

          <div>
            <span>Phone</span>

            <strong>{order.customer?.phone}</strong>
          </div>

          <div>
            <span>Clothing</span>

            <strong>{order.clothingType}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Order Information</h3>

        <div className="measurement-display">
          <div className="measurement-item">
            <span>Price</span>

            <strong>{order.price.toFixed(2)}</strong>
          </div>

          <div className="measurement-item">
            <span>Amount Paid</span>

            <strong>{order.amountPaid.toFixed(2)}</strong>
          </div>

          <div className="measurement-item">
            <span>Balance</span>

            <strong>{order.balance.toFixed(2)}</strong>
          </div>

          <div className="measurement-item">
            <span>Status</span>

            <strong>{order.status}</strong>
          </div>

          <div className="measurement-item">
            <span>Order Date</span>

            <strong>{new Date(order.orderDate).toLocaleDateString()}</strong>
          </div>

          <div className="measurement-item">
            <span>Delivery Date</span>

            <strong>
              {order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString()
                : "-"}
            </strong>
          </div>
        </div>
      </div>

      {order.description && (
        <div className="panel">
          <h3>Description</h3>

          <p>{order.description}</p>
        </div>
      )}

      {order.notes && (
        <div className="panel">
          <h3>Notes</h3>

          <p>{order.notes}</p>
        </div>
      )}

      <div className="panel">
        <h3>Customer Measurements</h3>

        <div className="measurement-display">
          {Object.entries(order.customer?.measurements || {})
            .filter(([key]) => key !== "notes" && key !== "_id")
            .map(([key, value]) => (
              <div className="measurement-item" key={key}>
                <span>{key}</span>

                <strong>{value || "-"}</strong>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
