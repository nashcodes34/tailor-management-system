import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

import { formatCurrency } from "../../utils/currency";

const PaymentReceipt = () => {
  const { id } = useParams();

  const [payment, setPayment] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayment = async () => {
      try {
        setError("");
        const response = await API.get(`/payments/${id}`);

        setPayment(response.data);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Unable to load this payment receipt. Please try again.",
        );
        setPayment(null);
      }
    };

    loadPayment();
  }, [id]);

  if (!payment && !error) {
    return (
      <Layout>
        <div className="panel">Loading receipt...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="panel">
          <h3>Unable to load receipt</h3>
          <p>{error}</p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="receipt-container">
        <div className="receipt">
          <div className="receipt-header">
            <h1>PAYMENT RECEIPT</h1>

            <p>{payment.receiptNumber}</p>
          </div>

          <hr />

          <div className="receipt-row">
            <span>Customer</span>

            <strong>{payment.customer?.name}</strong>
          </div>

          <div className="receipt-row">
            <span>Phone</span>

            <strong>{payment.customer?.phone}</strong>
          </div>

          <div className="receipt-row">
            <span>Order</span>

            <strong>#{payment.order?._id?.slice(-8)}</strong>
          </div>

          <div className="receipt-row">
            <span>Clothing</span>

            <strong>{payment.order?.clothingType}</strong>
          </div>

          <div className="receipt-row">
            <span>Payment Date</span>

            <strong>
              {new Date(payment.paymentDate).toLocaleDateString()}
            </strong>
          </div>

          <hr />

          <div className="receipt-total">
            <span>Amount Paid</span>

            <strong>{formatCurrency(payment.amount)}</strong>
          </div>

          <div className="receipt-row">
            <span>Payment Method</span>

            <strong>{payment.paymentMethod}</strong>
          </div>

          {payment.reference && (
            <div className="receipt-row">
              <span>Reference</span>

              <strong>{payment.reference}</strong>
            </div>
          )}

          {payment.notes && (
            <div className="receipt-notes">
              <strong>Notes</strong>

              <p>{payment.notes}</p>
            </div>
          )}

          <div className="receipt-footer">
            <p>Thank you for your business.</p>
          </div>
        </div>

        <div className="receipt-actions">
          <button className="primary-btn" onClick={() => window.print()}>
            🖨 Print Receipt
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentReceipt;
