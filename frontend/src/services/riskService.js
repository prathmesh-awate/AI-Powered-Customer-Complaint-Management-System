const API_URL = "http://localhost:8000";

export async function assessRisk(formData) {
  const response = await fetch(`${API_URL}/risk/assess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Risk API error:", error);
    throw new Error("Failed to assess risk");
  }

  return response.json();
}