from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class ComplaintBase(BaseModel):
    # Customer Details
    complaint_source: str
    customer_name: str
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None

    # Product Details
    product_name: str
    product_strength: Optional[str] = None
    batch_number: str
    manufacturing_date: Optional[date] = None
    expiry_date: Optional[date] = None
    quantity: Optional[int] = None

    # Complaint Details
    complaint_date: date
    complaint_type: str
    complaint_description: str

    # AI Assessment (filled later by AI)
    severity: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    confidence_score: Optional[float] = None
    ai_summary: Optional[str] = None
    suggested_action: Optional[str] = None


class ComplaintCreate(ComplaintBase):
    """Schema used when creating a complaint."""
    pass


class ComplaintResponse(ComplaintBase):
    id: int

    class Config:
        from_attributes = True