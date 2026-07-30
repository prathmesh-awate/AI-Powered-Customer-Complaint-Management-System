from fastapi import APIRouter
from pydantic import BaseModel

from app.services.groq_service import groq_service

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str


@router.post("/")
async def chat(request: ChatRequest):

    answer = groq_service.chat(request.message)

    return {
        "response": answer
    }