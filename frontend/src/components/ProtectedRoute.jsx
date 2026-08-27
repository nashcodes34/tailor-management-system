import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const hasToken = Boolean(localStorage.getItem("token"));

  if (!user && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  if (!user && hasToken) {
    return <div className="panel">Loading session...</div>;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
