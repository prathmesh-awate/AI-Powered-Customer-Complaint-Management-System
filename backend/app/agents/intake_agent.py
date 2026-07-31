import json
import os
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.graph.state import ComplaintState
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.1, api_key=os.getenv("GROQ_API_KEY"))

REQUIRED_FIELDS = [
    "productName", "batchLotNumber", "complaintDescription",
    "complaintType", "complaintDate", "initialSeverity"
]

INTAKE_PROMPT = """
You are a pharmaceutical complaint intake specialist.
Extract all complaint fields from the text and return a JSON object with:
- complaintSource, customerName, productName, productStrength
- batchLotNumber, manufacturingDate (YYYY-MM-DD), expiryDate (YYYY-MM-DD)
- quantityAffected (number only), complaintType, complaintDate (YYYY-MM-DD)
- complaintDescription, initialSeverity (low/medium/high/critical)
- priority (p1/p2/p3/p4), message
- suggestedSeverity (Minor/Moderate/Major/Critical)
- suggestedNextAction, initialRiskAssessment

Use today's date 2026-07-30 if complaint date not mentioned.
Infer day as 01 if only month/year given.
Return ONLY valid JSON, no markdown.
"""

def intake_agent(state: ComplaintState) -> ComplaintState:
    print("Intake Agent running...")

    response = llm.invoke([
        SystemMessage(content=INTAKE_PROMPT),
        HumanMessage(content=f"Extract complaint details from:\n\n{state['raw_text']}")
    ])

    raw = response.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    fields = json.loads(raw)
    missing = [f for f in REQUIRED_FIELDS if not fields.get(f)]

    print(f"Intake complete. Missing fields: {missing}")

    return {
        **state,
        "complaint_fields": fields,
        "is_complete": len(missing) == 0,
        "missing_fields": missing,
    }