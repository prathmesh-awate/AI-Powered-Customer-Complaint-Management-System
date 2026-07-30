from fastapi import FastAPI

from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.complaint import router as complaint_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Complaint Management API"
)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(complaint_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "API Running 🚀"
    }