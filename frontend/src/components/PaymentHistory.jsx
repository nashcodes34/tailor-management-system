import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../services/api";

const PaymentHistory = ({ order, refreshKey }) => {
  const [payments, setPayments] = useState([]);

  const loadPayments = async () => {
    try {
      const response = await API.get(`/payments/order/${order._id}`);

      setPayments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [order._id, refreshKey]);

  const deletePayment = async (id) => {
    const confirmed = window.confirm("Delete this payment?");

    if (!confirmed) return;

    try {
      await API.delete(`/payments/${id}`);

      loadPayments();

      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete payment");
    }
  };

  return (
    <div className="panel">
      <div className="section-header">
        <h3>Payment History</h3>
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
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>

                  <td>
                    <strong>
                      GH₵
                      {Number(payment.amount).toFixed(2)}
                    </strong>
                  </td>

                  <td>{payment.paymentMethod}</td>

                  <td>{payment.reference || "-"}</td>

                  <td>
                    <Link
                      to={`/tailor/payments/${payment._id}/receipt`}
                      className="action-btn"
                    >
                      Receipt
                    </Link>

                    <button
                      className="action-btn delete"
                      onClick={() => deletePayment(payment._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
