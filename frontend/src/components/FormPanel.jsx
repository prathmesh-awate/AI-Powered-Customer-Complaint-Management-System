import { useSelector, useDispatch } from "react-redux";
import { updateField, resetForm } from "../store/slices/formSlice";
import { saveComplaint } from "../services/complaintService";
import { useState } from "react";

export default function FormPanel() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form);
  const placeholder = "Awaiting AI extraction...";
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const handleChange = (field, value) => dispatch(updateField({ field, value }));
  const handleReset = () => dispatch(resetForm());

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveComplaint(formData);
      setSavedId(result.id);
      alert(`✅ Complaint saved! ID: ${result.id}`);
    } catch (err) {
      alert("❌ Failed to save complaint. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-panel">
      {/* Header */}
      <div className="form-header">
        <div>
          <h1 className="form-title">Log Customer Complaint</h1>
          <p className="form-subtitle">API & FDF Quality Assurance Module</p>
        </div>
        <span className="status-badge">Pending Triage</span>
      </div>

      {/* Section 1 */}
      <div className="form-section">
        <div className="section-title"><span className="section-number">1.</span> Origin & Customer Details</div>
        <div className="form-grid two-col">
          <div className="form-group">
            <label>Complaint Source</label>
            <input placeholder={placeholder} value={formData.complaintSource} onChange={(e) => handleChange("complaintSource", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input placeholder={placeholder} value={formData.customerName} onChange={(e) => handleChange("customerName", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="form-section">
        <div className="section-title"><span className="section-number">2.</span> Product & Batch Identification</div>
        <div className="form-grid two-col">
          <div className="form-group">
            <label>Product Name</label>
            <input placeholder={placeholder} value={formData.productName} onChange={(e) => handleChange("productName", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Product Strength/Grade</label>
            <input placeholder={placeholder} value={formData.productStrength} onChange={(e) => handleChange("productStrength", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Batch/Lot Number</label>
            <input placeholder={placeholder} value={formData.batchLotNumber} onChange={(e) => handleChange("batchLotNumber", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Manufacturing Date</label>
            <input type="date" value={formData.manufacturingDate} onChange={(e) => handleChange("manufacturingDate", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input type="date" value={formData.expiryDate} onChange={(e) => handleChange("expiryDate", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Quantity Affected</label>
            <div className="input-with-suffix">
              <input placeholder={placeholder} value={formData.quantityAffected} onChange={(e) => handleChange("quantityAffected", e.target.value)} />
              <span className="input-suffix">kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className="form-section">
        <div className="section-title"><span className="section-number">3.</span> Complaint Details</div>
        <div className="form-grid two-col">
          <div className="form-group">
            <label>Complaint Type</label>
            <input placeholder={placeholder} value={formData.complaintType} onChange={(e) => handleChange("complaintType", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Complaint Date</label>
            <input type="date" value={formData.complaintDate} onChange={(e) => handleChange("complaintDate", e.target.value)} />
          </div>
          <div className="form-group full-width">
            <label>Detailed Complaint Description</label>
            <textarea rows={4} placeholder={placeholder} value={formData.complaintDescription} onChange={(e) => handleChange("complaintDescription", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Section 4 - Initial Assessment */}
      <div className="form-section">
        <div className="section-title"><span className="section-number">4.</span> Initial Assessment & Priority</div>
        <div className="form-grid two-col">
          <div className="form-group">
            <label>Initial Severity</label>
            <select value={formData.initialSeverity} onChange={(e) => handleChange("initialSeverity", e.target.value)}>
              <option value="">Select severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={formData.priority} onChange={(e) => handleChange("priority", e.target.value)}>
              <option value="">Select priority</option>
              <option value="p1">P1 - Immediate</option>
              <option value="p2">P2 - High</option>
              <option value="p3">P3 - Medium</option>
              <option value="p4">P4 - Low</option>
            </select>
          </div>
        </div>

        {/* AI Copilot Risk Assessment - auto fills with form */}
        {(formData.suggestedSeverity || formData.suggestedNextAction || formData.initialRiskAssessment) && (
          <div className="ai-risk-box">
            <div className="ai-risk-header">
              <span className="ai-risk-icon">🛡</span>
              <h3>AI Copilot Risk Assessment</h3>
            </div>
            <div className="form-grid two-col">
              <div className="form-group">
                <label className="ai-risk-label">Severity (Suggested)</label>
                <input readOnly value={formData.suggestedSeverity} className="ai-risk-input" />
              </div>
              <div className="form-group">
                <label className="ai-risk-label">Suggested Next Action</label>
                <input readOnly value={formData.suggestedNextAction} className="ai-risk-input ai-risk-action" />
              </div>
              <div className="form-group full-width">
                <label className="ai-risk-label">Initial Risk Assessment</label>
                <textarea readOnly rows={3} value={formData.initialRiskAssessment} className="ai-risk-input" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button className="btn-reset" onClick={handleReset}>↺ Reset Form</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>
          {saving ? "⏳ Saving..." : "💾 Save Complaint"}
        </button>
      </div>
    </div>
  );
}