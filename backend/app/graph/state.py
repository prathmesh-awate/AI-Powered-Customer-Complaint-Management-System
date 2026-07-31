from typing import Optional, List
from typing_extensions import TypedDict

class ComplaintState(TypedDict):
    raw_text: str
    complaint_fields: Optional[dict]
    is_complete: Optional[bool]
    missing_fields: Optional[List[str]]
    risk_assessment: Optional[dict]
    severity: Optional[str]
    needs_regulatory_reporting: Optional[bool]
    assigned_department: Optional[str]
    escalated: Optional[bool]
    routing_reason: Optional[str]
    similar_complaints: Optional[List[dict]]
    root_cause_hypothesis: Optional[str]
    investigation_checklist: Optional[List[str]]
    complaint_id: Optional[int]
    final_summary: Optional[str]
    errors: Optional[List[str]]