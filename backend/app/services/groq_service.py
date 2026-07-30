import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

load_dotenv()


class GroqService:

    def __init__(self):

        self.llm = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model=os.getenv("MODEL_NAME", "gemma2-9b-it"),
            temperature=0.2,
        )

    def chat(self, prompt: str) -> str:

        response = self.llm.invoke(
            [HumanMessage(content=prompt)]
        )

        return response.content


groq_service = GroqService()