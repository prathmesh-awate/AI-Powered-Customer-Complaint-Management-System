import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { populateForm } from "../../store/slices/formSlice";
import { setAgentResults } from "../../store/slices/riskSlice";
import { setIsDragging, setUploadedFileName, setIsExtracting, setExtractionProgress } from "../../store/slices/aiSlice";

export default function UploadArea() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { isDragging, uploadedFileName, isExtracting, extractionProgress } = useSelector((state) => state.ai);

  const handleUpload = async (file) => {
    if (!file) return;
    dispatch(setUploadedFileName(file.name));
    dispatch(setIsExtracting(true));
    dispatch(setExtractionProgress(10));

    try {
      const formData = new FormData();
      formData.append("file", file);
      dispatch(setExtractionProgress(40));

      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();
      dispatch(setExtractionProgress(100));
      dispatch(setIsExtracting(false));

      if (result.complaintFields) dispatch(populateForm(result.complaintFields));
      dispatch(setAgentResults(result));

    } catch (error) {
      dispatch(setIsExtracting(false));
      dispatch(setExtractionProgress(0));
      console.error("Upload failed:", error.message);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); dispatch(setIsDragging(true)); };
  const handleDragLeave = () => dispatch(setIsDragging(false));
  const handleDrop = (e) => { e.preventDefault(); dispatch(setIsDragging(false)); handleUpload(e.dataTransfer.files[0]); };
  const handleFileChange = (e) => handleUpload(e.target.files[0]);

  return (
    <div className="upload-wrapper">
      {/* Drop Zone */}
      <div
        className={`upload-area ${isDragging ? "dragging" : ""} ${uploadedFileName ? "has-file" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} accept=".pdf,.docx,.txt,.eml" onChange={handleFileChange} hidden />
        {uploadedFileName ? (
          <>
            <span className="upload-icon">✅</span>
            <span className="upload-filename">{uploadedFileName}</span>
            <span className="upload-sub">Click to replace</span>
          </>
        ) : (
          <>
            <span className="upload-icon">📄</span>
            <span className="upload-text">Drop file or <strong>click to upload</strong></span>
            <span className="upload-sub">PDF, DOCX, TXT, EML</span>
          </>
        )}
      </div>

      {/* Progress Bar — only shows while processing */}
      {isExtracting && (
        <div className="extraction-progress">
          <div className="extraction-progress-bar">
            <div
              className="extraction-progress-fill"
              style={{ width: `${extractionProgress}%` }}
            />
          </div>
          <span className="extraction-progress-text">
            {extractionProgress < 40 ? " Reading file..." : extractionProgress < 100 ? " Extracting..." : "✅ Done!"}
          </span>
        </div>
      )}
    </div>
  );
}