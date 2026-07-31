import json
import os
import re
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from app.graph.state import ComplaintState
from app.tools.complaint_tools import search_similar_complaints
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2, api_key=os.getenv("GROQ_API_KEY"))

INVESTIGATION_SYSTEM = """You are a pharmaceutical investigation specialist.

Steps:
1. Use search_similar_complaints tool to find related historical complaints
2. Analyze patterns across similar complaints
3. Generate a comprehensive investigation plan

Your FINAL response must be ONLY a valid JSON object:
{
  "rootCauseHypothesis": "detailed expert hypothesis",
  "patternFound": true or false,
  "patternDescription": "",
  "investigationChecklist": ["step 1", "step 2"],
  "similarComplaints": [],
  "estimatedResolutionTime": "",
  "preventiveMeasures": []
}
No markdown. Only JSON.
"""

investigation_react_agent = create_react_agent(llm, [search_similar_complaints], prompt=INVESTIGATION_SYSTEM)


def extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {}


def investigation_agent(state: ComplaintState) -> ComplaintState:
    print("Investigation Agent running...")

    fields = state["complaint_fields"]
    context = f"""
    Product: {fields.get('productName')} {fields.get('productStrength')}
    Batch: {fields.get('batchLotNumber')}
    Type: {fields.get('complaintType')}
    Description: {fields.get('complaintDescription')}
    Risk Level: {state.get('severity')}
    Root Cause from Risk Agent: {state.get('risk_assessment', {}).get('rootCauseHypothesis', '')}
    """

    result = investigation_react_agent.invoke({
        "messages": [HumanMessage(content=f"Investigate this complaint and find patterns:\n{context}")]
    })

    last_message = result["messages"][-1].content

    try:
        investigation = extract_json(last_message)
    except Exception:
        investigation = {}

    print(f"  → Pattern found: {investigation.get('patternFound')}")
    print(f"  → Investigation complete\n")

    return {
        **state,
        "similar_complaints": investigation.get("similarComplaints", []),
        "root_cause_hypothesis": investigation.get("rootCauseHypothesis"),
        "investigation_checklist": investigation.get("investigationChecklist", []),
    }