import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";

import TailorDashboard from "./pages/tailor/TailorDashboard";

import Customers from "./pages/tailor/Customers";

import AddCustomer from "./pages/tailor/AddCustomer";

import Tailors from "./pages/admin/Tailors";

import AddTailor from "./pages/admin/AddTailor";

import EditTailor from "./pages/admin/EditTailor";

import AddPayment from "./pages/tailor/AddPayment";

import CustomerDetails from "./pages/tailor/CustomerDetails";

import EditCustomer from "./pages/tailor/EditCustomer";

import Orders from "./pages/tailor/Orders";

import AddOrder from "./pages/tailor/AddOrder";

import OrderDetails from "./pages/tailor/OrderDetails";

import EditOrder from "./pages/tailor/EditOrder";

import ShopProfile from "./pages/tailor/ShopProfile";

import PaymentReceipt from "./pages/tailor/PaymentReceipt";

import ChangePassword from "./pages/tailor/ChangePassword";

import Measurements from "./pages/tailor/AddMeasurement";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* LOGIN */}

          <Route path="/login" element={<Login />} />

          {/* ADMIN */}

          <Route
            path="/admin/tailors"
            element={
              <ProtectedRoute role="admin">
                <Tailors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tailors/new"
            element={
              <ProtectedRoute role="admin">
                <AddTailor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tailors/:id/edit"
            element={
              <ProtectedRoute role="admin">
                <EditTailor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* TAILOR */}

          <Route
            path="/tailor"
            element={
              <ProtectedRoute role="tailor">
                <TailorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/customers"
            element={
              <ProtectedRoute role="tailor">
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/customers/new"
            element={
              <ProtectedRoute role="tailor">
                <AddCustomer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/customers/:customerId/measurements/new"
            element={
              <ProtectedRoute role="tailor">
                <Measurements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/customers/:id"
            element={
              <ProtectedRoute role="tailor">
                <CustomerDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/customers/:id/edit"
            element={
              <ProtectedRoute role="tailor">
                <EditCustomer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/orders/:id/edit"
            element={
              <ProtectedRoute role="tailor">
                <EditOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/orders"
            element={
              <ProtectedRoute role="tailor">
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/change-password"
            element={
              <ProtectedRoute role="tailor">
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/profile"
            element={
              <ProtectedRoute role="tailor">
                <ShopProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/orders/:id/payment"
            element={
              <ProtectedRoute role="tailor">
                <AddPayment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/payments/:id/receipt"
            element={
              <ProtectedRoute role="tailor">
                <PaymentReceipt />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/payments"
            element={
              <ProtectedRoute role="tailor">
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/orders/new"
            element={
              <ProtectedRoute role="tailor">
                <AddOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tailor/orders/:id"
            element={
              <ProtectedRoute role="tailor">
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT */}

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
