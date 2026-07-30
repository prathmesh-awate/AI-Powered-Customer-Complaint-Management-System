import pdfplumber
import docx

def extract_text(file_path: str, filename: str) -> str:
    ext = filename.lower().split(".")[-1]

    if ext == "pdf":
        with pdfplumber.open(file_path) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)

    elif ext == "docx":
        doc = docx.Document(file_path)
        return "\n".join(para.text for para in doc.paragraphs)

    elif ext in ["txt", "eml"]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    else:
        raise ValueError(f"Unsupported file format: {ext}")