import { useSelector, useDispatch } from "react-redux";
import { setChatMessage, addChatMessage, addChatMessage as setLoading } from "../../store/slices/aiSlice";
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
      dispatch(addChatMessage({ role: "ai", text: data.response || data.message }));
    } catch (error) {
      dispatch(addChatMessage({ role: "ai", text: "Sorry, I couldn't process your request. Please try again." }));
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