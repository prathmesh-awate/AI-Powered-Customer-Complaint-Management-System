const API_URL = "http://localhost:8000";

export async function sendMessage(message) {
    const response = await fetch(`${API_URL}/chat/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to send message");
    }

    return response.json();
}