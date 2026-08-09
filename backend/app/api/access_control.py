from typing import List

from fastapi import APIRouter

from app.schemas.access_control import AccessControlResponse

from app.services.access_control_service import (
    get_all_access_controls,
    get_privileged_access_controls,
    get_high_risk_access_controls,
    get_excessive_access_controls,
)


router = APIRouter()


@router.get(
    "/access-control",
    response_model=List[AccessControlResponse],
)
def get_access_control():
    """
    Return access-control intelligence for all identities.
    """

    return get_all_access_controls()


@router.get(
    "/access-control/privileged",
    response_model=List[AccessControlResponse],
)
def get_privileged_access_control():
    """
    Return privileged access records.
    """

    return get_privileged_access_controls()


@router.get(
    "/access-control/high-risk",
    response_model=List[AccessControlResponse],
)
def get_high_risk_access_control():
    """
    Return high-risk access records.
    """

    return get_high_risk_access_controls()


@router.get(
    "/access-control/excessive",
    response_model=List[AccessControlResponse],
)
def get_excessive_access_control():
    """
    Return identities with excessive access.
    """

    return get_excessive_access_controls()