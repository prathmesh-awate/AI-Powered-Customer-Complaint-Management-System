from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.groq_service import extract_fields_from_text

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def chat(request: ChatRequest):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        extracted = extract_fields_from_text(request.message)
        return extracted

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))