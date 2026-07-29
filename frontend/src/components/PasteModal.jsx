import { useSelector, useDispatch } from "react-redux";
import { setPasteText, setShowPasteModal } from "../store/slices/aiSlice";

export default function PasteModal() {
  const dispatch = useDispatch();
  const pasteText = useSelector((state) => state.ai.pasteText);

  const handleClose = () => dispatch(setShowPasteModal(false));

  const handleExtract = () => {
    // AI extraction logic will go here
    dispatch(setShowPasteModal(false));
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