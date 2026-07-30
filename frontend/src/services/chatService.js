const API_URL = "http://localhost:8000";

export async function sendMessage(message) {
  const response = await fetch(`${API_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Chat API error:", error);
    throw new Error("Failed to send message");
  }

  const data = await response.json();
  console.log("Raw API data:", data);
  return data;
}