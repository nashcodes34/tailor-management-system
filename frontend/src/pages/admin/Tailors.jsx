import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const Tailors = () => {
  const [tailors, setTailors] = useState([]);

  const [search, setSearch] = useState("");

  const loadTailors = async () => {
    try {
      const response = await API.get("/admin/tailors");

      setTailors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTailors();
  }, []);

  const deleteTailor = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Tailor Master?",
    );

    if (!confirmed) return;

    try {
      await API.delete(`/admin/tailors/${id}`);

      loadTailors();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete tailor");
    }
  };

  const filteredTailors = tailors.filter(
    (tailor) =>
      tailor.shopName.toLowerCase().includes(search.toLowerCase()) ||
      tailor.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Tailor Masters</h2>

          <p>Manage all registered tailor shops.</p>
        </div>

        <Link to="/admin/tailors/new" className="primary-btn">
          + Add Tailor
        </Link>
      </div>

      <div className="panel">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search shop or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Shop</th>

                <th>Email</th>

                <th>Phone</th>

                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTailors.map((tailor) => (
                <tr key={tailor._id}>
                  <td>
                    <div className="shop-cell">
                      {tailor.logo ? (
                        <img
                          src={`http://localhost:5000${tailor.logo}`}
                          alt={tailor.shopName}
                          className="shop-logo"
                        />
                      ) : (
                        <div className="shop-logo-placeholder">✂</div>
                      )}

                      <strong>{tailor.shopName}</strong>
                    </div>
                  </td>

                  <td>{tailor.email}</td>

                  <td>{tailor.phone || "-"}</td>

                  <td>
                    <span
                      className={
                        tailor.active ? "badge success" : "badge danger"
                      }
                    >
                      {tailor.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/admin/tailors/${tailor._id}/edit`}
                      className="action-btn edit"
                    >
                      Edit
                    </Link>

                    <button
                      className="action-btn delete"
                      onClick={() => deleteTailor(tailor._id)}
                    >
                      Delete
                    </button>
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

export default Tailors;
