from fastapi import APIRouter

from app.services.analytics import get_analytics


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/")
def analytics():
    """
    Return enterprise IAM analytics.
    """

    return get_analytics()