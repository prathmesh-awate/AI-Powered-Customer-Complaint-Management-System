import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPasteText, setShowPasteModal, addChatMessage } from "../store/slices/aiSlice";
import { populateForm } from "../store/slices/formSlice";
import { setAgentResults } from "../store/slices/riskSlice";

export default function PasteModal() {
  const dispatch = useDispatch();
  const pasteText = useSelector((state) => state.ai.pasteText);
  const [processing, setProcessing] = useState(false);

  const handleClose = () => { if (!processing) dispatch(setShowPasteModal(false)); };

  const handleExtract = async () => {
    if (!pasteText.trim()) return;
    setProcessing(true);
    dispatch(addChatMessage({ role: "ai", text: " Starting multi-agent pipeline..." }));

    try {
      const response = await fetch("http://localhost:8000/agent/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasteText }),
      });

      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();

      // fill form fields
      if (result.complaintFields) {
        dispatch(populateForm(result.complaintFields));
      }

      // fill risk data
      dispatch(setAgentResults(result));

      // show agent steps in chat
      dispatch(addChatMessage({
        role: "ai",
        text: `Intake Agent\n→ Product: ${result.complaintFields?.productName}\n→ Batch: ${result.complaintFields?.batchLotNumber}`,
      }));
      dispatch(addChatMessage({
        role: "ai",
        text: `Risk Agent\n→ Severity: ${result.riskAssessment?.severityLevel}\n→ Score: ${result.riskAssessment?.overallRiskScore}/100`,
      }));
      if (result.similarComplaints?.length > 0) {
        dispatch(addChatMessage({
          role: "ai",
          text: `Investigation Agent\n→ ${result.similarComplaints.length} similar complaint(s) found`,
        }));
      }
      dispatch(addChatMessage({
        role: "ai",
        text: `Routing Agent\n→ Department: ${result.assignedDepartment}\n→ Escalated: ${result.escalated ? "YES" : "No"}`,
      }));
      dispatch(addChatMessage({ role: "ai", text: "Form auto-filled!" }));
      dispatch(setShowPasteModal(false));

    } catch (error) {
      dispatch(addChatMessage({ role: "ai", text: `Failed: ${error.message}` }));
      dispatch(setShowPasteModal(false));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Paste Complaint Text / Email</h3>
        <textarea
          rows={8}
          placeholder="Paste complaint text or email here..."
          value={pasteText}
          onChange={(e) => dispatch(setPasteText(e.target.value))}
          disabled={processing}
        />
        {processing && (
          <div className="agent-progress">
            <div className="agent-spinner" />
            <span>Running agent pipeline...</span>
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-reset" onClick={handleClose} disabled={processing}>Cancel</button>
          <button className="btn-save" onClick={handleExtract} disabled={processing}>
            {processing ? " Processing..." : "Process with Agents"}
          </button>
        </div>
      </div>
    </div>
  );
}