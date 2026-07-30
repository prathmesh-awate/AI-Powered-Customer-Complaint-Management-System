from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id                   = Column(Integer, primary_key=True, index=True)
    complaint_source     = Column(String(255), nullable=True)
    customer_name        = Column(String(255), nullable=True)
    product_name         = Column(String(255), nullable=True)
    product_strength     = Column(String(100), nullable=True)
    batch_lot_number     = Column(String(100), nullable=True)
    manufacturing_date   = Column(String(20), nullable=True)
    expiry_date          = Column(String(20), nullable=True)
    quantity_affected    = Column(String(50), nullable=True)
    complaint_type       = Column(String(100), nullable=True)
    complaint_date       = Column(String(20), nullable=True)
    complaint_description = Column(Text, nullable=True)
    initial_severity     = Column(String(50), nullable=True)
    priority             = Column(String(10), nullable=True)

    # AI Risk Assessment
    suggested_severity      = Column(String(100), nullable=True)
    suggested_next_action   = Column(String(500), nullable=True)
    initial_risk_assessment = Column(Text, nullable=True)

    # Metadata
    status      = Column(String(50), default="Pending Triage")
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())