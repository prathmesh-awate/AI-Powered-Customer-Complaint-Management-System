from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.graph.complaint_graph import complaint_graph

router = APIRouter(prefix="/agent", tags=["agent"])

class AgentRequest(BaseModel):
    text: str

@router.post("/process")
async def process_complaint(request: AgentRequest):
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        print(f"\n{'='*50}")
        print("🚀 Starting complaint agent pipeline")
        print(f"{'='*50}\n")

        result = complaint_graph.invoke({
            "raw_text": request.text,
            "errors": []
        })

        return {
            "complaintFields":        result.get("complaint_fields"),
            "riskAssessment":         result.get("risk_assessment"),
            "assignedDepartment":     result.get("assigned_department"),
            "escalated":              result.get("escalated"),
            "routingReason":          result.get("routing_reason"),
            "similarComplaints":      result.get("similar_complaints"),
            "rootCauseHypothesis":    result.get("root_cause_hypothesis"),
            "investigationChecklist": result.get("investigation_checklist"),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))