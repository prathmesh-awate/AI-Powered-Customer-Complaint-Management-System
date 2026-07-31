import json
import os
import re
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from app.graph.state import ComplaintState
from app.tools.complaint_tools import validate_complaint_completeness
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.1, api_key=os.getenv("GROQ_API_KEY"))

INTAKE_SYSTEM = """You are a pharmaceutical complaint intake specialist.

Steps:
1. Extract all complaint fields from the provided text
2. Use the validate_complaint_completeness tool to check if required fields are present
3. Return your final response as a valid JSON object with all extracted fields

Extract these fields:
- complaintSource, customerName, productName, productStrength
- batchLotNumber, manufacturingDate (YYYY-MM-DD), expiryDate (YYYY-MM-DD)
- quantityAffected (number only), complaintType, complaintDate (YYYY-MM-DD)
- complaintDescription, initialSeverity (low/medium/high/critical), priority (p1/p2/p3/p4)
- message, suggestedSeverity (Minor/Moderate/Major/Critical)

Use today's date 2026-07-31 if complaint date not mentioned.
Your FINAL response must be ONLY a valid JSON object with all extracted fields. No markdown.
"""

intake_react_agent = create_react_agent(llm, [validate_complaint_completeness], prompt=INTAKE_SYSTEM)


def extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except Exception:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {}


def intake_agent(state: ComplaintState) -> ComplaintState:
    print("Intake Agent running...")

    result = intake_react_agent.invoke({
        "messages": [HumanMessage(content=f"Extract complaint details from:\n\n{state['raw_text']}")]
    })

    last_message = result["messages"][-1].content

    try:
        fields = extract_json(last_message)
    except Exception:
        fields = {}

    required = ["productName", "batchLotNumber", "complaintDescription", "complaintType", "complaintDate", "initialSeverity"]
    missing = [f for f in required if not fields.get(f)]
    print(f"  → Missing fields: {missing}")
    print(f"  → Intake complete\n")

    return {
        **state,
        "complaint_fields": fields,
        "is_complete": len(missing) == 0,
        "missing_fields": missing,
    }