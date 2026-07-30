import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_service import extract_text
from app.services.groq_service import extract_fields_from_text

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Save file temporarily
        ext = file.filename.lower().split(".")[-1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Step 1: Extract text from file
        text = extract_text(tmp_path, file.filename)
        os.unlink(tmp_path)

        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file")

        # Step 2: Send to Groq LLM → get structured JSON
        extracted = extract_fields_from_text(text)

        return extracted

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))