import { useSelector } from "react-redux";

export default function ProgressBar() {
  const { extractionProgress, isExtracting } = useSelector((state) => state.ai);

  return (
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
  );
}