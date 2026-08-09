from typing import List

from fastapi import APIRouter

from app.schemas.identity import IdentityResponse
from app.services.identity_service import (
    get_all_identities,
    get_privileged_identities,
    get_inactive_identities,
    get_excessive_access_identities,
    get_high_risk_identities,
)


router = APIRouter()


@router.get(
    "/identities",
    response_model=List[IdentityResponse],
)
def get_identities():
    return get_all_identities()


@router.get(
    "/identities/privileged",
    response_model=List[IdentityResponse],
)
def get_privileged():
    return get_privileged_identities()


@router.get(
    "/identities/inactive",
    response_model=List[IdentityResponse],
)
def get_inactive():
    return get_inactive_identities()


@router.get(
    "/identities/excessive-access",
    response_model=List[IdentityResponse],
)
def get_excessive_access():
    return get_excessive_access_identities()


@router.get(
    "/identities/high-risk",
    response_model=List[IdentityResponse],
)
def get_high_risk():
    return get_high_risk_identities()