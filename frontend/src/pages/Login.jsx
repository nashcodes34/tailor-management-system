import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("tailor");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [paymentLoading, setPaymentLoading] = useState(false);

  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) return;

    const verifyPayment = async () => {
      setPaymentLoading(true);
      try {
        const response = await API.get(`/subscriptions/verify/${reference}`);
        setPaymentMessage(response.data.message);
        setSearchParams({}, { replace: true });
      } catch (error) {
        setError(
          error.response?.data?.message || "Payment verification failed",
        );
      } finally {
        setPaymentLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      const user = await login(email, password, role);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/tailor");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    setError("");
    setPaymentMessage("");
    setPaymentLoading(true);

    try {
      const response = await API.post("/subscriptions/initialize", { email });
      window.location.assign(response.data.authorizationUrl);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to start payment");
      setPaymentLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="brand-logo">✂</div>

          <h1>TailorPro</h1>

          <p>Tailor Management System</p>
        </div>

        <h2>Welcome Back</h2>

        {error && <div className="error">{error}</div>}

        {paymentMessage && <div className="success">{paymentMessage}</div>}

        <form onSubmit={handleSubmit}>
          <label>Login As</label>

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="tailor">Tailor Master</option>

            <option value="admin">Administrator</option>
          </select>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {role === "tailor" && error.includes("monthly access") && (
          <button
            type="button"
            onClick={handleReactivate}
            disabled={paymentLoading}
          >
            {paymentLoading ? "Opening payment..." : "Pay monthly access fee"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
