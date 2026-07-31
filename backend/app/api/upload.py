import io
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_service import extract_text
from app.graph.complaint_graph import complaint_graph

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        file_like = io.BytesIO(contents)  # wrap bytes in file-like object
        raw_text = extract_text(file_like, file.filename)

        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file")

        print(f"📄 Extracted text from {file.filename}, running agent pipeline...")

        result = complaint_graph.invoke({
            "raw_text": raw_text,
            "errors": []
        })

        fields = result.get("complaint_fields", {})

        return {
            **fields,
            "complaintFields":        fields,
            "riskAssessment":         result.get("risk_assessment"),
            "assignedDepartment":     result.get("assigned_department"),
            "escalated":              result.get("escalated"),
            "routingReason":          result.get("routing_reason"),
            "similarComplaints":      result.get("similar_complaints"),
            "rootCauseHypothesis":    result.get("root_cause_hypothesis"),
            "investigationChecklist": result.get("investigation_checklist"),
            "message": f"✅ Agents complete. Severity: {result.get('risk_assessment', {}).get('severityLevel')} | Assigned to: {result.get('assigned_department')}",
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))