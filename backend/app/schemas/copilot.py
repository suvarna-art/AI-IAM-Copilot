from pydantic import BaseModel


class CopilotRequest(BaseModel):
    prompt: str


class CopilotResponse(BaseModel):
    answer: str
    intent: str
    risk_level: str
    recommendations: list[str]