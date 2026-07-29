import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsDragging,
  setChatMessage,
  addChatMessage,
  setShowPasteModal,
  setUploadedFileName,
} from "../store/slices/aiSlice";
import PasteModal from "./PasteModal";

export default function AIPanel() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const {
    extractionProgress,
    isExtracting,
    chatMessage,
    chatHistory,
    showPasteModal,
    isDragging,
    uploadedFileName,
  } = useSelector((state) => state.ai);

  const handleDragOver = (e) => {
    e.preventDefault();
    dispatch(setIsDragging(true));
  };

  const handleDragLeave = () => dispatch(setIsDragging(false));

  const handleDrop = (e) => {
    e.preventDefault();
    dispatch(setIsDragging(false));
    const file = e.dataTransfer.files[0];
    if (file) dispatch(setUploadedFileName(file.name));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(setUploadedFileName(file.name));
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    dispatch(addChatMessage({ role: "user", text: chatMessage }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendChat();
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <span className="ai-icon">✦</span>
          <h2>AI Complaint Intake Assistant</h2>
        </div>
        <span className="beta-badge">BETA</span>
      </div>

      {/* DROP ZONE */}
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <div className="drop-zone-icon">☁</div>
        {uploadedFileName ? (
          <p>📎 <strong>{uploadedFileName}</strong></p>
        ) : (
          <p>
            Drag & drop complaint document here
            <br />
            or <span className="link">click to browse</span>
          </p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept=".pdf,.docx,.txt,.eml"
          onChange={handleFileChange}
        />
      </div>

      <div className="divider-or">OR</div>

      <button className="btn-paste" onClick={() => dispatch(setShowPasteModal(true))}>
        <span>📄</span> Paste Complaint Text / Email
      </button>

      <div className="supported-formats">
        <span className="formats-icon">✓</span>
        <span>
          Supported formats: PDF, DOCX, TXT, EML
          <br />
          Max file size: 10MB
        </span>
      </div>

      {/* EXTRACTION PROGRESS */}
      <div className="extraction-section">
        <h3 className="extraction-title">EXTRACTION PROGRESS</h3>
        <div className="progress-bar-container">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${extractionProgress}%` }}
            />
          </div>
          <span className="progress-label">{extractionProgress}%</span>
        </div>
        {isExtracting && (
          <p className="extraction-status">
            Analyzing document content and extracting key details...
            <br />
            Please wait, this may take a few moments.
          </p>
        )}
      </div>

      {/* AI ASSISTANT */}
      <div className="ai-assistant-section">
        <h3 className="ai-assistant-title">AI ASSISTANT</h3>
        <div className="ai-messages">
          <div className="ai-message">
            <div className="ai-avatar">🤖</div>
            <p>
              Upload a complaint document or paste text above.
              <br />
              I will automatically extract the details and populate the form for you.
            </p>
          </div>
          {chatHistory.map((msg, i) => (
            <div key={i} className={`ai-message ${msg.role === "user" ? "user-message" : ""}`}>
              <div className="ai-avatar">{msg.role === "user" ? "🧑" : "🤖"}</div>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT INPUT */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me anything about this complaint..."
          value={chatMessage}
          onChange={(e) => dispatch(setChatMessage(e.target.value))}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" onClick={handleSendChat}>➤</button>
      </div>
      <p className="ai-disclaimer">AI responses may contain errors. Please verify information.</p>

      {showPasteModal && <PasteModal />}
    </div>
  );
}