import { useSelector } from "react-redux";

export default function RiskPanel() {
  const { riskData, assignedDepartment, escalated, routingReason, similarComplaints, investigationChecklist } = useSelector((state) => state.risk);

  if (!riskData) return null;

  return (
    <div className="risk-panel">
      <div className="ai-risk-box">
        <div className="ai-risk-header">
          <span>🛡</span>
          <h3>AI Copilot Risk Assessment</h3>
          {escalated && <span className="ai-risk-escalated"> ESCALATED</span>}
        </div>
        <div className="form-grid two-col">
          <div className="form-group">
            <label className="ai-risk-label">Severity</label>
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
    </div>
  );
}