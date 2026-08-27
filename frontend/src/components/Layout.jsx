import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  const location = useLocation();

  const isAdmin = user?.role === "admin";

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>✂</span>

          <h2>TailorPro</h2>
        </div>

        <div className="user-info">
          {/* <Link to={isAdmin ? "/admin" : "/tailor"}> */}
          <div className="avatar">
            {isAdmin ? "A" : user?.shopName?.charAt(0)}
          </div>

          <div>
            <strong>{isAdmin ? user.name : user.shopName}</strong>

            <small>{isAdmin ? "Administrator" : "Tailor Master"}</small>
          </div>
          {/* </Link> */}
        </div>

        <nav>
          {isAdmin ? (
            <>
              <Link
                className={location.pathname === "/admin" ? "active" : ""}
                to="/admin"
              >
                📊 Dashboard
              </Link>

              <Link
                className={
                  location.pathname.includes("/admin/tailors") ? "active" : ""
                }
                to="/admin/tailors"
              >
                ✂ Tailor Masters
              </Link>
            </>
          ) : (
            <>
              <Link
                className={location.pathname === "/tailor" ? "active" : ""}
                to="/tailor"
              >
                📊 Dashboard
              </Link>
              <Link
                className={
                  location.pathname.includes("/tailor/customers")
                    ? "active"
                    : ""
                }
                to="/tailor/customers"
              >
                👥 Customers
              </Link>
              <Link to="/tailor/orders" className="sidebar-link">
                <span>🧵</span>
                Orders
              </Link>
              <Link to="/tailor/change-password">🔐 Change Password</Link>
              <Link to="/tailor/profile">⚙ Shop Profile</Link>
            </>
          )}
        </nav>

        <button className="logout" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{isAdmin ? "Administration" : user?.shopName}</h1>

            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <section className="content">{children}</section>
      </main>
    </div>
  );
};

export default Layout;
