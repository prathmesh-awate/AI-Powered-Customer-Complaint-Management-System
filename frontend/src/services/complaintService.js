const API_URL = "http://localhost:8000";

export async function saveComplaint(formData) {
  // Convert any number fields to strings before sending
  const sanitized = {
    ...formData,
    quantityAffected: String(formData.quantityAffected ?? ""),
  };

  const response = await fetch(`${API_URL}/complaints/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanitized),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Save complaint error:", error);
    throw new Error(error);
  }

  return response.json();
}

export async function getAllComplaints() {
  const response = await fetch(`${API_URL}/complaints/`);
  if (!response.ok) throw new Error("Failed to fetch complaints");
  return response.json();
}

export async function deleteComplaint(id) {
  const response = await fetch(`${API_URL}/complaints/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete complaint");
  return response.json();
}