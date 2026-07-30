from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database import engine, Base
from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.complaint import router as complaints_router

load_dotenv()

# Auto-create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Complaint Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(complaints_router)

@app.get("/")
def root():
    return {"message": "API Running 🚀"}