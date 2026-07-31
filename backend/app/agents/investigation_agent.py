import json
import os
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.graph.state import ComplaintState
from app.database import SessionLocal
from app.models import Complaint
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2, api_key=os.getenv("GROQ_API_KEY"))

INVESTIGATION_PROMPT = """
You are a pharmaceutical investigation specialist.
Based on the complaint and similar past complaints, generate an investigation plan.
Return ONLY a JSON object with:

{
  "rootCauseHypothesis": "detailed expert hypothesis",
  "patternFound": true or false,
  "patternDescription": "description of pattern or empty string",
  "investigationChecklist": ["step 1", "step 2"],
  "estimatedResolutionTime": "e.g. 7-14 days",
  "preventiveMeasures": ["measure 1", "measure 2"]
}

Return ONLY valid JSON, no markdown.
"""

def get_similar_complaints(product_name: str) -> list:
    db = SessionLocal()
    try:
        complaints = db.query(Complaint).filter(
            Complaint.product_name.ilike(f"%{product_name}%")
        ).order_by(Complaint.created_at.desc()).limit(5).all()
        return [
            {
                "id": c.id,
                "productName": c.product_name,
                "batchLotNumber": c.batch_lot_number,
                "complaintType": c.complaint_type,
                "complaintDescription": c.complaint_description,
                "initialSeverity": c.initial_severity,
            }
            for c in complaints
        ]
    finally:
        db.close()

def investigation_agent(state: ComplaintState) -> ComplaintState:
    print("🔍 Investigation Agent running...")

    fields = state["complaint_fields"]
    similar = get_similar_complaints(fields.get("productName", ""))

    context = f"""
    Current Complaint:
    Product: {fields.get('productName')} {fields.get('productStrength')}
    Batch: {fields.get('batchLotNumber')}
    Type: {fields.get('complaintType')}
    Description: {fields.get('complaintDescription')}

    Similar Past Complaints:
    {json.dumps(similar, indent=2)}
    """

    response = llm.invoke([
        SystemMessage(content=INVESTIGATION_PROMPT),
        HumanMessage(content=f"Generate investigation plan:\n{context}")
    ])

    raw = response.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    investigation = json.loads(raw)

    print(f"✅ Investigation complete. Pattern found: {investigation.get('patternFound')}")

    return {
        **state,
        "similar_complaints": similar,
        "root_cause_hypothesis": investigation.get("rootCauseHypothesis"),
        "investigation_checklist": investigation.get("investigationChecklist"),
    }