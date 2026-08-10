from fastapi import APIRouter

from app.services.roles import (
    get_all_roles,
    get_high_risk_roles,
)


router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
)


@router.get("/")
def roles():
    """
    Return all enterprise IAM roles.
    """

    return get_all_roles()


@router.get("/high-risk")
def high_risk_roles():
    """
    Return high-risk IAM roles.
    """

    return get_high_risk_roles()