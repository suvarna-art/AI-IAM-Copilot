from fastapi import APIRouter

router = APIRouter()


@router.get("/ai-confidence")
def get_ai_confidence():
    return {
        "score": 98,
        "prediction": "Identity Risk Stable",
        "trend": "+4%"
    }