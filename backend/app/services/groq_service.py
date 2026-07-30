import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are an AI complaint intake assistant for a pharmaceutical company.
Extract ALL complaint fields AND perform an initial risk assessment.

Return ONLY a valid JSON object with these exact keys:

Complaint fields:
- complaintSource, customerName, productName, productStrength, batchLotNumber
- manufacturingDate (YYYY-MM-DD), expiryDate (YYYY-MM-DD)
- quantityAffected (number only), complaintType, complaintDate (YYYY-MM-DD)
- complaintDescription, initialSeverity (low/medium/high/critical)
- priority (p1/p2/p3/p4)
- message (1-2 sentence summary)

Risk assessment fields (infer from complaint context):
- suggestedSeverity: one of: Minor / Moderate / Major / Critical
- suggestedNextAction: short action string e.g. "Route to QA Investigation & Issue Replacement"
- initialRiskAssessment: 1-2 sentence expert risk assessment explaining root cause and recommended investigation

RULES:
- Never leave a field empty if info is available
- Infer manufacturing date day as 01 if only month/year given
- Use today's date 2026-07-30 if complaint date not mentioned
- Return ONLY valid JSON, no markdown, no extra text
"""

def extract_fields_from_text(text: str) -> dict:
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Extract all complaint details and assess risk from this text:\n\n{text}"},
        ],
        temperature=0.1,
    )

    raw = completion.choices[0].message.content.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    return json.loads(raw)