import { useSelector, useDispatch } from "react-redux";
import { setRiskData, setIsAssessing, setError } from "../store/slices/riskSlice";
import { assessRisk } from "../services/riskService";

const severityColor = {
  Critical: "#dc2626",
  High: "#ea580c",
  Medium: "#d97706",
  Low: "#16a34a",
};

const riskColor = {
  High: "#dc2626",
  Medium: "#d97706",
  Low: "#16a34a",
  Immediate: "#dc2626",
  Probable: "#ea580c",
  Possible: "#d97706",
  Unlikely: "#16a34a",
  None: "#16a34a",
};

export default function RiskPanel() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form);
  const { riskData, isAssessing, error } = useSelector((state) => state.risk);

  const handleAssess = async () => {
    dispatch(setIsAssessing(true));
    try {
      const data = await assessRisk(formData);
      dispatch(setRiskData(data));
    } catch (err) {
      dispatch(setError("Failed to assess risk. Please try again."));
    }
  };

  return (
    <div className="risk-panel">
      <div className="risk-panel-header">
        <div className="risk-panel-title">
          <span>⚠️</span>
          <h2>AI Copilot Risk Assessment</h2>
        </div>
        <button
          className="btn-assess"
          onClick={handleAssess}
          disabled={isAssessing}
        >
          {isAssessing ? "⏳ Assessing..." : "🔍 Run Risk Assessment"}
        </button>
      </div>

      {error && <div className="risk-error">{error}</div>}

      {!riskData && !isAssessing && (
        <div className="risk-empty">
          <p>Fill in the complaint form and click <strong>Run Risk Assessment</strong> to get an AI-powered risk analysis.</p>
        </div>
      )}

      {isAssessing && (
        <div className="risk-loading">
          <div className="risk-loading-spinner" />
          <p>AI Copilot is analyzing the complaint...</p>
        </div>
      )}

      {riskData && (
        <div className="risk-content">

          {/* Overall Risk Score */}
          <div className="risk-score-card">
            <div
              className="risk-score-circle"
              style={{ borderColor: riskData.overallRiskScore > 70 ? "#dc2626" : riskData.overallRiskScore > 40 ? "#d97706" : "#16a34a" }}
            >
              <span className="risk-score-number">{riskData.overallRiskScore}</span>
              <span className="risk-score-label">/ 100</span>
            </div>
            <div className="risk-score-summary">
              <h3>Overall Risk Score</h3>
              <p>{riskData.copilotSummary}</p>
            </div>
          </div>

          {/* Severity */}
          <div className="risk-section">
            <h3 className="risk-section-title">Severity Classification</h3>
            <div className="risk-severity-row">
              <span
                className="risk-badge"
                style={{ background: severityColor[riskData.severityClassification?.level] }}
              >
                {riskData.severityClassification?.level}
              </span>
              <span className="risk-score-pill">Score: {riskData.severityClassification?.score}/10</span>
            </div>
            <p className="risk-reasoning">{riskData.severityClassification?.reasoning}</p>
          </div>

          {/* Risk Assessment */}
          <div className="risk-section">
            <h3 className="risk-section-title">Risk Assessment</h3>
            <div className="risk-grid">
              <div className="risk-item">
                <span className="risk-item-label">Patient Safety Risk</span>
                <span className="risk-badge" style={{ background: riskColor[riskData.riskAssessment?.patientSafetyRisk] }}>
                  {riskData.riskAssessment?.patientSafetyRisk}
                </span>
              </div>
              <div className="risk-item">
                <span className="risk-item-label">Regulatory Risk</span>
                <span className="risk-badge" style={{ background: riskColor[riskData.riskAssessment?.regulatoryRisk] }}>
                  {riskData.riskAssessment?.regulatoryRisk}
                </span>
              </div>
              <div className="risk-item">
                <span className="risk-item-label">Recall Probability</span>
                <span className="risk-badge" style={{ background: riskColor[riskData.riskAssessment?.recallProbability] }}>
                  {riskData.riskAssessment?.recallProbability}
                </span>
              </div>
            </div>
            <p className="risk-reasoning">{riskData.riskAssessment?.summary}</p>
          </div>

          {/* Recommended Actions */}
          <div className="risk-section">
            <h3 className="risk-section-title">Recommended Actions</h3>
            <div className="risk-actions-list">
              {riskData.recommendedActions?.map((action, i) => (
                <div key={i} className="risk-action-item">
                  <div className="risk-action-header">
                    <span className="risk-action-priority">P{action.priority}</span>
                    <span className="risk-action-dept">{action.department}</span>
                    <span className="risk-action-time">{action.timeframe}</span>
                  </div>
                  <p>{action.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Investigation Checklist */}
          <div className="risk-section">
            <h3 className="risk-section-title">Investigation Checklist</h3>
            <ul className="risk-checklist">
              {riskData.investigationChecklist?.map((item, i) => (
                <li key={i}>
                  <input type="checkbox" id={`check-${i}`} />
                  <label htmlFor={`check-${i}`}>{item}</label>
                </li>
              ))}
            </ul>
          </div>

          {/* Regulatory Reporting */}
          <div className="risk-section">
            <h3 className="risk-section-title">Regulatory Reporting</h3>
            <div className="risk-regulatory">
              <span className={`risk-badge ${riskData.regulatoryReporting?.required ? "badge-red" : "badge-green"}`}>
                {riskData.regulatoryReporting?.required ? "⚠ Reporting Required" : "✓ No Reporting Required"}
              </span>
              {riskData.regulatoryReporting?.required && (
                <div className="risk-agencies">
                  <strong>Agencies:</strong> {riskData.regulatoryReporting?.agencies?.join(", ")}
                  <br />
                  <strong>Deadline:</strong> {riskData.regulatoryReporting?.deadline}
                </div>
              )}
              <p className="risk-reasoning">{riskData.regulatoryReporting?.reasoning}</p>
            </div>
          </div>

          {/* Pattern */}
          <div className="risk-section">
            <h3 className="risk-section-title">Pattern Analysis</h3>
            <p className="risk-reasoning">{riskData.similarCasesPattern}</p>
          </div>

        </div>
      )}
    </div>
  );
}