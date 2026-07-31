import json
from langchain_core.tools import tool
from app.database import SessionLocal
from app.models import Complaint


@tool
def validate_complaint_completeness(fields_json: str) -> str:
    """Validate that all required complaint fields are present. Pass extracted fields as a JSON string."""
    required = [
        "productName", "batchLotNumber", "complaintDescription",
        "complaintType", "complaintDate", "initialSeverity"
    ]
    try:
        fields = json.loads(fields_json)
        missing = [f for f in required if not fields.get(f)]
        return json.dumps({
            "isComplete": len(missing) == 0,
            "missingFields": missing
        })
    except Exception as e:
        return json.dumps({"isComplete": False, "missingFields": required, "error": str(e)})


@tool
def search_similar_complaints(product_name: str) -> str:
    """Search the database for similar complaints by product name. Use this to detect duplicate or recurring issues."""
    db = SessionLocal()
    try:
        complaints = db.query(Complaint).filter(
            Complaint.product_name.ilike(f"%{product_name}%")
        ).order_by(Complaint.created_at.desc()).limit(5).all()

        result = [
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
        return json.dumps(result if result else [])
    finally:
        db.close()


@tool
def check_regulatory_requirements(complaint_type: str, severity: str) -> str:
    """Check if FDA/EMA regulatory reporting is required based on complaint type and severity level."""
    severity_lower = severity.lower()
    type_lower = complaint_type.lower()

    high_risk_types = ["contamination", "sterility", "mislabeling", "wrong product", "overdose", "mix-up"]
    needs_reporting = (
        severity_lower in ["critical", "high"] or
        any(t in type_lower for t in high_risk_types)
    )

    agencies = ["FDA", "EMA"] if needs_reporting else []
    deadline = "15 days" if severity_lower == "critical" else "30 days" if severity_lower == "high" else ""

    return json.dumps({
        "needsRegulatoryReporting": needs_reporting,
        "reportingAgencies": agencies,
        "reportingDeadline": deadline
    })


@tool
def get_department_routing(complaint_type: str, severity: str, needs_regulatory_reporting: str) -> str:
    """Determine which department to assign the complaint based on type, severity and regulatory needs."""
    severity_lower = severity.lower()
    type_lower = complaint_type.lower()
    needs_reg = needs_regulatory_reporting.lower() == "true"

    if needs_reg:
        dept = "Regulatory Affairs"
        escalated = True
    elif severity_lower == "critical":
        dept = "Senior Management"
        escalated = True
    elif severity_lower == "high":
        dept = "Quality Assurance"
        escalated = True
    elif "manufacturing" in type_lower or "contamination" in type_lower:
        dept = "Manufacturing"
        escalated = False
    elif "medical" in type_lower or "adverse" in type_lower:
        dept = "Medical Affairs"
        escalated = False
    else:
        dept = "Quality Assurance"
        escalated = False

    urgency_map = {"critical": "Immediate", "high": "24hrs", "medium": "7days", "low": "30days"}

    return json.dumps({
        "assignedDepartment": dept,
        "escalated": escalated,
        "urgency": urgency_map.get(severity_lower, "7days"),
    })