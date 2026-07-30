from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintCreate(BaseModel):
    complaintSource:       Optional[str] = ""
    customerName:          Optional[str] = ""
    productName:           Optional[str] = ""
    productStrength:       Optional[str] = ""
    batchLotNumber:        Optional[str] = ""
    manufacturingDate:     Optional[str] = ""
    expiryDate:            Optional[str] = ""
    quantityAffected:      Optional[str] = ""
    complaintType:         Optional[str] = ""
    complaintDate:         Optional[str] = ""
    complaintDescription:  Optional[str] = ""
    initialSeverity:       Optional[str] = ""
    priority:              Optional[str] = ""
    suggestedSeverity:     Optional[str] = ""
    suggestedNextAction:   Optional[str] = ""
    initialRiskAssessment: Optional[str] = ""

class ComplaintResponse(BaseModel):
    id:                    int
    complaintSource:       Optional[str]
    customerName:          Optional[str]
    productName:           Optional[str]
    productStrength:       Optional[str]
    batchLotNumber:        Optional[str]
    manufacturingDate:     Optional[str]
    expiryDate:            Optional[str]
    quantityAffected:      Optional[str]
    complaintType:         Optional[str]
    complaintDate:         Optional[str]
    complaintDescription:  Optional[str]
    initialSeverity:       Optional[str]
    priority:              Optional[str]
    suggestedSeverity:     Optional[str]
    suggestedNextAction:   Optional[str]
    initialRiskAssessment: Optional[str]
    status:                Optional[str]
    created_at:            Optional[datetime]

    class Config:
        from_attributes = True