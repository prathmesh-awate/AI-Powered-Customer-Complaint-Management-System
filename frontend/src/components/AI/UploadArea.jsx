import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsDragging,
  setUploadedFileName,
  setShowPasteModal,
  setIsExtracting,
  setExtractionProgress,
  addChatMessage,
} from "../../store/slices/aiSlice";
import { populateForm } from "../../store/slices/formSlice";
import { uploadDocument } from "../../services/uploadService";

export default function UploadArea() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { isDragging, uploadedFileName } = useSelector((state) => state.ai);

  const handleUpload = async (file) => {
    if (!file) return;
    dispatch(setUploadedFileName(file.name));
    dispatch(setIsExtracting(true));
    dispatch(setExtractionProgress(10));

    try {
      dispatch(setExtractionProgress(40));
      const data = await uploadDocument(file);
      dispatch(setExtractionProgress(100));
      dispatch(setIsExtracting(false));

      // Auto-fill the form
      dispatch(populateForm(data));

      dispatch(addChatMessage({
        role: "ai",
        text: data.message || "Document processed. Form has been auto-filled with extracted details.",
      }));
    } catch (error) {
      dispatch(setIsExtracting(false));
      dispatch(setExtractionProgress(0));
      dispatch(addChatMessage({
        role: "ai",
        text: "Failed to process document. Please try again.",
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dispatch(setIsDragging(true));
  };

  const handleDragLeave = () => dispatch(setIsDragging(false));

  const handleDrop = (e) => {
    e.preventDefault();
    dispatch(setIsDragging(false));
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  return (
    <>
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
    </>
  );
}