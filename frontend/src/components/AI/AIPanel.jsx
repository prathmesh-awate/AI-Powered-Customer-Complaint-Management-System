import { useSelector, useDispatch } from "react-redux";
import { setShowPasteModal } from "../../store/slices/aiSlice";
import UploadArea from "./UploadArea";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import PasteModal from "../PasteModal";

export default function AIPanel() {
  const dispatch = useDispatch();
  const { showPasteModal } = useSelector((state) => state.ai);

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <span className="ai-icon">✦</span>
          <h2>AI Complaint Intake Assistant</h2>
        </div>
        <span className="beta-badge">BETA</span>
      </div>

      <UploadArea />
      <ChatWindow />
      <ChatInput />

      {showPasteModal && <PasteModal onClose={() => dispatch(setShowPasteModal(false))} />}
    </div>
  );
}