from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Complaint
from app.schemas import ComplaintCreate, ComplaintResponse

router = APIRouter(prefix="/complaints", tags=["complaints"])

@router.post("/", response_model=ComplaintResponse)
def create_complaint(data: ComplaintCreate, db: Session = Depends(get_db)):
    complaint = Complaint(
        complaint_source      = data.complaintSource,
        customer_name         = data.customerName,
        product_name          = data.productName,
        product_strength      = data.productStrength,
        batch_lot_number      = data.batchLotNumber,
        manufacturing_date    = data.manufacturingDate,
        expiry_date           = data.expiryDate,
        quantity_affected     = data.quantityAffected,
        complaint_type        = data.complaintType,
        complaint_date        = data.complaintDate,
        complaint_description = data.complaintDescription,
        initial_severity      = data.initialSeverity,
        priority              = data.priority,
        suggested_severity      = data.suggestedSeverity,
        suggested_next_action   = data.suggestedNextAction,
        initial_risk_assessment = data.initialRiskAssessment,
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return _to_response(complaint)

@router.get("/", response_model=List[ComplaintResponse])
def get_all_complaints(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    return [_to_response(c) for c in complaints]

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return _to_response(complaint)

@router.delete("/{complaint_id}")
def delete_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    db.delete(complaint)
    db.commit()
    return {"message": "Complaint deleted"}

def _to_response(c: Complaint) -> dict:
    return {
        "id":                    c.id,
        "complaintSource":       c.complaint_source,
        "customerName":          c.customer_name,
        "productName":           c.product_name,
        "productStrength":       c.product_strength,
        "batchLotNumber":        c.batch_lot_number,
        "manufacturingDate":     c.manufacturing_date,
        "expiryDate":            c.expiry_date,
        "quantityAffected":      c.quantity_affected,
        "complaintType":         c.complaint_type,
        "complaintDate":         c.complaint_date,
        "complaintDescription":  c.complaint_description,
        "initialSeverity":       c.initial_severity,
        "priority":              c.priority,
        "suggestedSeverity":     c.suggested_severity,
        "suggestedNextAction":   c.suggested_next_action,
        "initialRiskAssessment": c.initial_risk_assessment,
        "status":                c.status,
        "created_at":            c.created_at,
    }