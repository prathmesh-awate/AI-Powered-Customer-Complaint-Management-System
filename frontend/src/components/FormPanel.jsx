import { useSelector, useDispatch } from "react-redux";
import { updateField, resetForm } from "../store/slices/formSlice";
import { resetAI } from "../store/slices/aiSlice";

export default function FormPanel() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form);
  const placeholder = "Awaiting AI extraction...";

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleReset = () => {
    dispatch(resetForm());
    dispatch(resetAI());
  };

  return (
    <div className="form-panel">
      <div className="form-header">
        <div>
          <h1 className="form-title">Log Customer Complaint</h1>
          <p className="form-subtitle">API & FDF Quality Assurance Module</p>
        </div>
        <span className="status-badge">Pending Triage</span>
      </div>

      {/* SECTION 1 */}
      <section className="form-section">
        <h2 className="section-title">
          <span className="section-number">1.</span> ORIGIN & CUSTOMER DETAILS
        </h2>
        <div className="form-grid two-col">
          <div className="form-group">
            <label>Complaint Source</label>
            <input
              type="text"
              placeholder={placeholder}
              value={formData.complaintSource}
              onChange={(e) => handleChange("complaintSource", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              placeholder={placeholder}
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="form-section">
        <h2 className="section-title">
          <span className="section-number">2.</span> PRODUCT & BATCH IDENTIFICATION
        </h2>
        <div className="form-grid two-col">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              placeholder={placeholder}
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Product Strength/Grade</label>
            <input
              type="text"
              placeholder={placeholder}
              value={formData.productStrength}
              onChange={(e) => handleChange("productStrength", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Batch/Lot Number</label>
            <input
              type="text"
              placeholder={placeholder}
              value={formData.batchLotNumber}
              onChange={(e) => handleChange("batchLotNumber", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Manufacturing Date</label>
            <input
              type="date"
              value={formData.manufacturingDate}
              onChange={(e) => handleChange("manufacturingDate", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleChange("expiryDate", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Quantity Affected</label>
            <div className="input-with-suffix">
              <input
                type="text"
                placeholder={placeholder}
                value={formData.quantityAffected}
                onChange={(e) => handleChange("quantityAffected", e.target.value)}
              />
              <span className="input-suffix">kg</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="form-section">
        <h2 className="section-title">
          <span className="section-number">3.</span> COMPLAINT DETAILS
        </h2>
        <div className="form-grid two-col">
          <div className="form-group">
            <label>Complaint Type</label>
            <input
              type="text"
              placeholder={placeholder}
              value={formData.complaintType}
              onChange={(e) => handleChange("complaintType", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Complaint Date</label>
            <input
              type="date"
              value={formData.complaintDate}
              onChange={(e) => handleChange("complaintDate", e.target.value)}
            />
          </div>
        </div>
        <div className="form-group full-width" style={{ marginTop: "14px" }}>
          <label>Detailed Complaint Description</label>
          <textarea
            placeholder={placeholder}
            rows={4}
            value={formData.complaintDescription}
            onChange={(e) => handleChange("complaintDescription", e.target.value)}
          />
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="form-section">
        <h2 className="section-title">
          <span className="section-number">4.</span> INITIAL ASSESSMENT & PRIORITY
        </h2>
        <div className="form-grid two-col">
          <div className="form-group">
            <label>Initial Severity</label>
            <select
              value={formData.initialSeverity}
              onChange={(e) => handleChange("initialSeverity", e.target.value)}
            >
              <option value="" disabled>{placeholder}</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              <option value="" disabled>{placeholder}</option>
              <option value="p1">P1 - Urgent</option>
              <option value="p2">P2 - High</option>
              <option value="p3">P3 - Normal</option>
              <option value="p4">P4 - Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* FORM ACTIONS */}
      <div className="form-actions">
        <button className="btn-reset" onClick={handleReset}>
          <span className="btn-icon">↺</span> Reset Form
        </button>
        <button className="btn-save">
          <span className="btn-icon">💾</span> Save Complaint
        </button>
      </div>
    </div>
  );
}