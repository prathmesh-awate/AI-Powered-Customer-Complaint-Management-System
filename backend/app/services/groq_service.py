import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are an AI complaint intake assistant for a pharmaceutical company.
Your job is to extract ALL possible information from the complaint text and return a JSON object.

RULES:
- Extract every field you can find, even if it is partially mentioned
- For fields not explicitly stated, make a reasonable inference based on context
- NEVER leave a field as empty string if there is ANY relevant information in the text
- complaintSource: who reported it (pharmacy name, customer name, company)
- customerName: person or organization reporting the complaint
- productName: name of the drug/product
- productStrength: dosage strength (e.g. 500mg, 250ml)
- batchLotNumber: batch, lot, or serial number
- manufacturingDate: format YYYY-MM-DD, infer day as 01 if only month/year given
- expiryDate: format YYYY-MM-DD, infer day as 01 if only month/year given
- quantityAffected: number only, no units. If not stated use "1"
- complaintType: classify as one of: Quality Defect, Packaging Issue, Labeling Issue, Foreign Matter, Contamination, Wrong Product, Expired Product, Adverse Event
- complaintDate: format YYYY-MM-DD, use today's date if not mentioned (2026-07-30)
- complaintDescription: full detailed description of the complaint, expand with all details mentioned
- initialSeverity: must be one of: low, medium, high, critical. Infer from context (discoloration = high, contamination = critical)
- priority: must be one of: p1, p2, p3, p4. Infer from severity (high=p1, medium=p2, low=p3)
- message: a 1-2 sentence professional summary of the complaint

Return ONLY a valid JSON object. No extra text, no markdown, no code blocks.
"""

def extract_fields_from_text(text: str) -> dict:
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Extract all complaint details from this text:\n\n{text}"},
        ],
        temperature=0.1,
    )

    raw = completion.choices[0].message.content.strip()

    # Strip markdown code blocks if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    return json.loads(raw)