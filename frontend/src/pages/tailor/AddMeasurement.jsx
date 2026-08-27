import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../services/api";

import Layout from "../../components/Layout";

const AddMeasurement = () => {
  const { customerId } = useParams();

  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  const [templates, setTemplates] = useState([]);

  const [template, setTemplate] = useState(null);

  const [values, setValues] = useState({});

  const [unit, setUnit] = useState("inch");

  const [notes, setNotes] = useState("");

  const [measuredAt, setMeasuredAt] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customerResponse, templatesResponse] = await Promise.all([
          API.get(`/customer/${customerId}`),

          API.get("/measurements/templates"),
        ]);

        setCustomer(customerResponse.data);

        setTemplates(templatesResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [customerId]);

  const handleTemplateChange = (e) => {
    const selected = templates.find((item) => item._id === e.target.value);

    setTemplate(selected || null);

    setValues({});
  };

  const handleValueChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!template) {
      alert("Please select a measurement type.");

      return;
    }

    setLoading(true);

    try {
      await API.post("/measurements", {
        customer: customerId,

        template: template._id,

        unit,

        values: Object.fromEntries(
          Object.entries(values).map(([key, value]) => [key, Number(value)]),
        ),

        notes,

        measuredAt,
      });

      navigate(`/tailor/customers/${customerId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save measurement");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return (
      <Layout>
        <div className="panel">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Add Measurement</h2>

          <p>
            Customer: <strong>{customer.name}</strong>
          </p>
        </div>
      </div>

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Measurement Type</label>

            <select
              value={template?._id || ""}
              onChange={handleTemplateChange}
              required
            >
              <option value="">Select garment</option>

              {templates.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Unit</label>

            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="inch">Inches</option>

              <option value="cm">Centimeters</option>
            </select>
          </div>

          <div className="form-group">
            <label>Measurement Date</label>

            <input
              type="date"
              value={measuredAt}
              onChange={(e) => setMeasuredAt(e.target.value)}
            />
          </div>
        </div>

        {template && (
          <>
            <div className="measurement-header">
              <h3>{template.name} Measurements</h3>

              <span>Unit: {unit}</span>
            </div>

            <div className="measurement-grid">
              {template.fields
                .sort((a, b) => a.position - b.position)
                .map((field) => (
                  <div className="form-group" key={field.name}>
                    <label>
                      {field.label}

                      {field.required && <span className="required">*</span>}
                    </label>

                    <div className="measurement-input">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={values[field.name] || ""}
                        onChange={(e) =>
                          handleValueChange(field.name, e.target.value)
                        }
                        required={field.required}
                      />

                      <span>{unit}</span>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        <div className="form-group">
          <label>Notes</label>

          <textarea
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional measurement notes..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate(`/tailor/customers/${customerId}`)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading || !template}
          >
            {loading ? "Saving..." : "Save Measurement"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default AddMeasurement;
