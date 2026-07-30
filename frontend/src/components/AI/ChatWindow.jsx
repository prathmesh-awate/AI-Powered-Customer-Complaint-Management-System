import { useSelector } from "react-redux";

export default function ChatWindow() {
  const { chatHistory } = useSelector((state) => state.ai);

  return (
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
          <div
            key={i}
            className={`ai-message ${msg.role === "user" ? "user-message" : ""}`}
          >
            <div className="ai-avatar">{msg.role === "user" ? "🧑" : "🤖"}</div>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}