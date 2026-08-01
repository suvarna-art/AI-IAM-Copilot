from fastapi import APIRouter

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("")
async def get_dashboard():

    return {
        "securityScore": 94,
        "activeIdentities": 12486,
        "highRiskAccounts": 17,
        "pendingReviews": 83
    }