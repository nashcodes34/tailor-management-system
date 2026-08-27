import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const loadCustomers = async () => {
    try {
      const response = await API.get("/customer");

      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const deleteCustomer = async (id) => {
    const confirmed = window.confirm("Delete this customer?");

    if (!confirmed) return;

    try {
      await API.delete(`/customer/${id}`);

      loadCustomers();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete customer");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Customers</h2>

          <p>Manage customer measurements.</p>
        </div>

        <Link to="/tailor/customers/new" className="primary-btn">
          + Add Customer
        </Link>
      </div>

      <div className="panel">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>

                <th>Phone</th>

                <th>Date</th>

                <th>Waist</th>

                <th>Arm</th>

                <th>Leg</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    <strong>{customer.name}</strong>
                  </td>

                  <td>{customer.phone}</td>

                  <td>{new Date(customer.date).toLocaleDateString()}</td>

                  <td>{customer.measurements?.waist || "-"}</td>

                  <td>{customer.measurements?.armLength || "-"}</td>

                  <td>{customer.measurements?.legLength || "-"}</td>

                  <td>
                    <Link
                      to={`/tailor/customers/${customer._id}`}
                      className="action-btn view"
                    >
                      View
                    </Link>

                    <Link
                      to={`/tailor/customers/${customer._id}/edit`}
                      className="action-btn edit"
                    >
                      Edit
                    </Link>

                    <button
                      className="action-btn delete"
                      onClick={() => deleteCustomer(customer._id)}
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

export default Customers;
