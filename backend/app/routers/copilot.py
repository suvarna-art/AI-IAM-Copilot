from fastapi import APIRouter

from app.schemas.copilot import CopilotRequest, CopilotResponse
from app.services.copilot import process_copilot_prompt


router = APIRouter()


@router.post("/ai/copilot", response_model=CopilotResponse)
def copilot(request: CopilotRequest):
    return process_copilot_prompt(request.prompt)