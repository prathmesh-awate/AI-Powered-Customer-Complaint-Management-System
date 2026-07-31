import json
import os
import re
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from app.graph.state import ComplaintState
from app.tools.complaint_tools import check_regulatory_requirements, search_similar_complaints
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2, api_key=os.getenv("GROQ_API_KEY"))

RISK_SYSTEM = """You are a senior pharmaceutical QA expert with 20+ years experience in ICH Q10 and GMP guidelines.

Steps:
1. Use check_regulatory_requirements tool to determine if FDA/EMA reporting is needed
2. Use search_similar_complaints tool to check for historical patterns
3. Based on all findings, return a complete risk assessment as a valid JSON object

Your FINAL response must be ONLY a valid JSON object:
{
  "severityLevel": "Critical / High / Medium / Low",
  "severityScore": 1-10,
  "severityReasoning": "...",
  "patientSafetyRisk": "Immediate / Probable / Possible / Unlikely",
  "regulatoryRisk": "High / Medium / Low",
  "recallProbability": "High / Medium / Low / None",
  "needsRegulatoryReporting": true or false,
  "reportingAgencies": [],
  "reportingDeadline": "",
  "recommendedActions": [{"priority": 1, "action": "", "timeframe": "", "department": ""}],
  "investigationChecklist": [],
  "rootCauseHypothesis": "",
  "overallRiskScore": 1-100,
  "riskSummary": "2-3 sentence executive summary"
}
No markdown. Only JSON.
"""

risk_react_agent = create_react_agent(llm, [check_regulatory_requirements, search_similar_complaints], prompt=RISK_SYSTEM)


def extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {}


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
    Manufacturing Date: {fields.get('manufacturingDate')}
    Expiry: {fields.get('expiryDate')}
    Source: {fields.get('complaintSource')}
    """

    result = risk_react_agent.invoke({
        "messages": [HumanMessage(content=f"Assess risk for this complaint:\n{complaint_text}")]
    })

    last_message = result["messages"][-1].content

    try:
        risk = extract_json(last_message)
    except Exception:
        risk = {}

    print(f"  → Risk complete. Severity: {risk.get('severityLevel')}, Score: {risk.get('overallRiskScore')}\n")

    return {
        **state,
        "risk_assessment": risk,
        "severity": risk.get("severityLevel"),
        "needs_regulatory_reporting": risk.get("needsRegulatoryReporting", False),
    }