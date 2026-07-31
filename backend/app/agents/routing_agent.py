import json
import os
import re
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from app.graph.state import ComplaintState
from app.tools.complaint_tools import get_department_routing
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.1, api_key=os.getenv("GROQ_API_KEY"))

ROUTING_SYSTEM = """You are a pharmaceutical complaint routing specialist.

Steps:
1. Use get_department_routing tool with complaint type, severity and regulatory requirements
2. Provide final routing decision with full justification

Your FINAL response must be ONLY a valid JSON object:
{
  "assignedDepartment": "",
  "escalated": true or false,
  "escalationReason": "",
  "routingReason": "",
  "urgency": "Immediate / 24hrs / 7days / 30days",
  "notifyStakeholders": []
}
No markdown. Only JSON.
"""

routing_react_agent = create_react_agent(llm, [get_department_routing], prompt=ROUTING_SYSTEM)


def extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {}


def routing_agent(state: ComplaintState) -> ComplaintState:
    print("Routing Agent running...")

    fields = state["complaint_fields"]
    risk = state.get("risk_assessment", {})

    context = f"""
    Complaint Type: {fields.get('complaintType')}
    Severity: {risk.get('severityLevel')}
    Risk Score: {risk.get('overallRiskScore')}
    Needs Regulatory Reporting: {risk.get('needsRegulatoryReporting')}
    Patient Safety Risk: {risk.get('patientSafetyRisk')}
    Recall Probability: {risk.get('recallProbability')}
    """

    result = routing_react_agent.invoke({
        "messages": [HumanMessage(content=f"Route this complaint:\n{context}")]
    })

    last_message = result["messages"][-1].content

    try:
        routing = extract_json(last_message)
    except Exception:
        routing = {}
    escalated_str = "YES" if routing.get("escalated") else "NO"
    print(f"  → Department: {routing.get('assignedDepartment')}, Escalated: {escalated_str}")
    print(f"  → Routing complete\n")

    return {
        **state,
        "assigned_department": routing.get("assignedDepartment"),
        "escalated": routing.get("escalated"),
        "routing_reason": routing.get("routingReason"),
    }