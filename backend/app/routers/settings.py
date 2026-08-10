from fastapi import APIRouter

from app.services.settings import get_settings


router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get("/")
def settings():
    """
    Return enterprise IAM application settings.
    """

    return get_settings()