import { useSelector, useDispatch } from "react-redux";
import { setChatMessage, addChatMessage } from "../../store/slices/aiSlice";
import { populateForm } from "../../store/slices/formSlice";
import { setAgentResults } from "../../store/slices/riskSlice";

export default function ChatInput() {
  const dispatch = useDispatch();
  const { chatMessage } = useSelector((state) => state.ai);

  const handleSend = async () => {
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    dispatch(setChatMessage(""));
    dispatch(addChatMessage({ role: "user", text: userMsg }));

    try {
      const response = await fetch("http://localhost:8000/agent/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMsg }),
      });

      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();

      // fill form fields
      if (result.complaintFields) dispatch(populateForm(result.complaintFields));

      // fill risk panel
      dispatch(setAgentResults(result));

      dispatch(addChatMessage({
        role: "ai",
        text: ` Done! Form and risk assessment have been filled.`,
      }));

    } catch (error) {
      console.error("Agent error:", error);
      dispatch(addChatMessage({
        role: "ai",
        text: "Sorry, I couldn't process your request. Please try again.",
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me anything about this complaint..."
          value={chatMessage}
          onChange={(e) => dispatch(setChatMessage(e.target.value))}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" onClick={handleSend}>➤</button>
      </div>
      <p className="ai-disclaimer">AI responses may contain errors. Please verify information.</p>
    </>
  );
}