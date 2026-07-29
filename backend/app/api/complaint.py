from fastapi import APIRouter
from app.schemas.complaint import ComplaintCreate

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)

fake_database = []


@router.post("/")
async def save_complaint(complaint: ComplaintCreate):

    fake_database.append(complaint.model_dump())

    return {
        "message": "Complaint saved successfully",
        "complaint": complaint
    }