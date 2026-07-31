import json
import os
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.graph.state import ComplaintState
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2, api_key=os.getenv("GROQ_API_KEY"))

RISK_PROMPT = """
You are a senior pharmaceutical QA expert with 20+ years experience.
Perform a full risk assessment and return ONLY a JSON object with:

{
  "severityLevel": "Critical / High / Medium / Low",
  "severityScore": 1-10,
  "severityReasoning": "why this severity",
  "patientSafetyRisk": "Immediate / Probable / Possible / Unlikely",
  "regulatoryRisk": "High / Medium / Low",
  "recallProbability": "High / Medium / Low / None",
  "needsRegulatoryReporting": true or false,
  "reportingAgencies": ["FDA", "EMA"] or [],
  "reportingDeadline": "deadline or empty string",
  "recommendedActions": [
    {"priority": 1, "action": "...", "timeframe": "...", "department": "..."}
  ],
  "investigationChecklist": ["step 1", "step 2"],
  "rootCauseHypothesis": "expert hypothesis on root cause",
  "overallRiskScore": 1-100,
  "riskSummary": "2-3 sentence executive summary"
}

Base assessment on ICH Q10, GMP guidelines and regulatory standards.
Return ONLY valid JSON, no markdown.
"""

def risk_agent(state: ComplaintState) -> ComplaintState:
    print("Risk Agent running...")

    fields = state["complaint_fields"]
    complaint_text = f"""
    Product: {fields.get('productName')} {fields.get('productStrength')}
    Batch: {fields.get('batchLotNumber')}
    Type: {fields.get('complaintType')}
    Description: {fields.get('complaintDescription')}
    Severity: {fields.get('initialSeverity')}
    Quantity Affected: {fields.get('quantityAffected')}
    Mfg Date: {fields.get('manufacturingDate')}
    Expiry: {fields.get('expiryDate')}
    Source: {fields.get('complaintSource')}
    """

    response = llm.invoke([
        SystemMessage(content=RISK_PROMPT),
        HumanMessage(content=f"Assess risk for:\n{complaint_text}")
    ])

    raw = response.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    risk = json.loads(raw)

    print(f"Risk complete. Severity: {risk.get('severityLevel')}, Score: {risk.get('overallRiskScore')}")

    return {
        **state,
        "risk_assessment": risk,
        "severity": risk.get("severityLevel"),
        "needs_regulatory_reporting": risk.get("needsRegulatoryReporting", False),
    }