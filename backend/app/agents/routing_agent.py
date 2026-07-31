import json
import os
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.graph.state import ComplaintState
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.1, api_key=os.getenv("GROQ_API_KEY"))

ROUTING_PROMPT = """
You are a pharmaceutical complaint routing specialist.
Based on the complaint and risk assessment, decide routing.
Return ONLY a JSON object with:

{
  "assignedDepartment": "QA / Regulatory Affairs / Manufacturing / Medical Affairs / Senior Management",
  "escalated": true or false,
  "escalationReason": "why escalated or empty string",
  "routingReason": "why routed to this department",
  "urgency": "Immediate / 24hrs / 7days / 30days",
  "notifyStakeholders": ["QA Manager", "Regulatory Affairs"]
}

Rules:
- Critical severity → escalated = true, notify Senior Management
- Regulatory reporting needed → assign Regulatory Affairs
- Manufacturing defect → assign Manufacturing
- Return ONLY valid JSON, no markdown.
"""

def routing_agent(state: ComplaintState) -> ComplaintState:
    print("Routing Agent running...")

    fields = state["complaint_fields"]
    risk = state["risk_assessment"]

    context = f"""
    Complaint Type: {fields.get('complaintType')}
    Severity: {risk.get('severityLevel')}
    Risk Score: {risk.get('overallRiskScore')}
    Regulatory Reporting Needed: {risk.get('needsRegulatoryReporting')}
    Recommended Actions: {json.dumps(risk.get('recommendedActions', []))}
    """

    response = llm.invoke([
        SystemMessage(content=ROUTING_PROMPT),
        HumanMessage(content=f"Route this complaint:\n{context}")
    ])

    raw = response.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    routing = json.loads(raw)

    print(f"Routing complete. Department: {routing.get('assignedDepartment')}, Escalated: {routing.get('escalated')}")

    return {
        **state,
        "assigned_department": routing.get("assignedDepartment"),
        "escalated": routing.get("escalated"),
        "routing_reason": routing.get("routingReason"),
    }