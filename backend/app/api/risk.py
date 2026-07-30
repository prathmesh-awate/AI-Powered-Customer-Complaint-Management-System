from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.risk_service import assess_risk

router = APIRouter(prefix="/risk", tags=["risk"])

class ComplaintData(BaseModel):
    productName: Optional[str] = ""
    productStrength: Optional[str] = ""
    batchLotNumber: Optional[str] = ""
    complaintType: Optional[str] = ""
    complaintDescription: Optional[str] = ""
    initialSeverity: Optional[str] = ""
    quantityAffected: Optional[str] = ""
    manufacturingDate: Optional[str] = ""
    expiryDate: Optional[str] = ""
    complaintSource: Optional[str] = ""

@router.post("/assess")
async def risk_assessment(data: ComplaintData):
    try:
        if not data.complaintDescription and not data.productName:
            raise HTTPException(status_code=400, detail="At least a product name or complaint description is required")

        result = assess_risk(data.dict())
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))