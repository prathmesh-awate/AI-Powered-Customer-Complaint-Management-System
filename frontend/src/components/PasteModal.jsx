import { useSelector, useDispatch } from "react-redux";
import { setPasteText, setShowPasteModal, addChatMessage } from "../store/slices/aiSlice";
import { populateForm } from "../store/slices/formSlice";
import { sendMessage } from "../services/chatService";

export default function PasteModal() {
  const dispatch = useDispatch();
  const pasteText = useSelector((state) => state.ai.pasteText);

  const handleClose = () => dispatch(setShowPasteModal(false));

  const handleExtract = async () => {
    if (!pasteText.trim()) return;
    try {
      const data = await sendMessage(pasteText);
      console.log("API Response:", data); // check this in browser console

      dispatch(populateForm(data));
      console.log("populateForm dispatched with:", data); // confirm dispatch

      dispatch(addChatMessage({
        role: "ai",
        text: data.message || "Text processed. Form has been auto-filled.",
      }));
      dispatch(setShowPasteModal(false));
    } catch (error) {
      console.error("Error:", error);
      dispatch(addChatMessage({
        role: "ai",
        text: "Failed to process text. Please try again.",
      }));
      dispatch(setShowPasteModal(false));
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Paste Complaint Text / Email</h3>
        <textarea
          rows={8}
          placeholder="Paste complaint text or email content here..."
          value={pasteText}
          onChange={(e) => dispatch(setPasteText(e.target.value))}
        />
        <div className="modal-actions">
          <button className="btn-reset" onClick={handleClose}>Cancel</button>
          <button className="btn-save" onClick={handleExtract}>Extract & Fill</button>
        </div>
      </div>
    </div>
  );
}