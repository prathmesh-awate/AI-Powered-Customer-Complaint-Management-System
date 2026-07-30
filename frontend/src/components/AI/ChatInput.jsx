import { useSelector, useDispatch } from "react-redux";
import { setChatMessage, addChatMessage } from "../../store/slices/aiSlice";
import { populateForm } from "../../store/slices/formSlice";
import { sendMessage } from "../../services/chatService";

export default function ChatInput() {
  const dispatch = useDispatch();
  const { chatMessage } = useSelector((state) => state.ai);

  const handleSend = async () => {
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    dispatch(addChatMessage({ role: "user", text: userMsg }));

    try {
      const data = await sendMessage(userMsg);
      console.log("Chat response:", data);

      // Auto-fill the form
      dispatch(populateForm(data));

      dispatch(addChatMessage({
        role: "ai",
        text: data.message || "I've extracted the details and populated the form for you.",
      }));
    } catch (error) {
      console.error("Error:", error);
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