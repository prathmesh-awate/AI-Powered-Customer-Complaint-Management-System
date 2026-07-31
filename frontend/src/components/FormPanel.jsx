import { useSelector, useDispatch } from "react-redux";
import { updateField, resetForm } from "../store/slices/formSlice";
import { resetRisk } from "../store/slices/riskSlice";
import { saveComplaint } from "../services/complaintService";
import { useState } from "react";

export default function FormPanel() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form);
  const { riskData, assignedDepartment, escalated, routingReason, similarComplaints } = useSelector((state) => state.risk);
  const placeholder = "Awaiting AI extraction...";
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // form is filled if at least product name and complaint description exist
  const isFormFilled = formData.productName && formData.complaintDescription;
  const getStatus = () => {
    if (submitted) return { label: "Submitted", className: "status-badge submitted" };
    if (isFormFilled) return { label: "Ready to Submit", className: "status-badge ready" };
    return { label: "Pending Triage", className: "status-badge pending" };
  };

  const handleChange = (field, value) => dispatch(updateField({ field, value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveComplaint(formData);
      setSubmitted(true);
      alert(`Complaint saved! ID: ${result.id}`);
    } catch (err) {
      alert("Failed to save complaint.");
    } finally {
      setSaving(false);
    }
  };
  const handleReset = () => {
    dispatch(resetForm());
    dispatch(resetRisk());
    setSubmitted(false);
  };

  const status = getStatus();


  return (
    <div className="form-panel">
      {/* Header */}
      <div className="form-header">
        <div>
          <h1 className="form-title">Log Customer Complaint</h1>
          <p className="form-subtitle">API & FDF Quality Assurance Module</p>
        </div>
        <span className={status.className}>{status.label}</span>
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

        {/* AI Risk Box — only shows after agent pipeline runs */}
        {riskData && (
          <div className="ai-risk-box">
            <div className="ai-risk-header">
              <span>🛡</span>
              <h3>AI Copilot Risk Assessment</h3>
              {escalated && <span className="ai-risk-escalated">⚠️ ESCALATED</span>}
            </div>
            <div className="form-grid two-col">
              <div className="form-group">
                <label className="ai-risk-label">Severity (Suggested)</label>
                <input readOnly value={riskData.severityLevel || ""} className="ai-risk-input" />
              </div>
              <div className="form-group">
                <label className="ai-risk-label">Risk Score</label>
                <input readOnly value={`${riskData.overallRiskScore || ""} / 100`} className="ai-risk-input" />
              </div>
              <div className="form-group">
                <label className="ai-risk-label">Patient Safety Risk</label>
                <input readOnly value={riskData.patientSafetyRisk || ""} className="ai-risk-input" />
              </div>
              <div className="form-group">
                <label className="ai-risk-label">Assigned Department</label>
                <input readOnly value={assignedDepartment || ""} className="ai-risk-input" />
              </div>
              <div className="form-group">
                <label className="ai-risk-label">Recall Probability</label>
                <input readOnly value={riskData.recallProbability || ""} className="ai-risk-input" />
              </div>
              <div className="form-group">
                <label className="ai-risk-label">Regulatory Reporting</label>
                <input readOnly value={riskData.needsRegulatoryReporting ? "Required" : "Not Required"} className="ai-risk-input" />
              </div>
              <div className="form-group full-width">
                <label className="ai-risk-label">Risk Summary</label>
                <textarea readOnly rows={3} value={riskData.riskSummary || ""} className="ai-risk-input" />
              </div>
              {routingReason && (
                <div className="form-group full-width">
                  <label className="ai-risk-label">Routing Reason</label>
                  <textarea readOnly rows={2} value={routingReason} className="ai-risk-input" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button className="btn-reset" onClick={handleReset}>↺ Reset Form</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : " Save Complaint"}
        </button>
      </div>
    </div>
  );
}