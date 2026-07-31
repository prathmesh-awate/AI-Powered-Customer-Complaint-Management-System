from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.graph.complaint_graph import complaint_graph

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def chat(request: ChatRequest):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        result = complaint_graph.invoke({
            "raw_text": request.message,
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