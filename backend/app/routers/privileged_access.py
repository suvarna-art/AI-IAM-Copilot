from fastapi import APIRouter

from app.services.privileged_access import (
    get_all_privileged_accounts,
    get_high_risk_privileged_accounts,
    get_mfa_disabled_privileged_accounts,
)


router = APIRouter(
    prefix="/privileged-access",
    tags=["Privileged Access"],
)


@router.get("/")
def privileged_access():
    """
    Return all privileged accounts.
    """

    return get_all_privileged_accounts()


@router.get("/high-risk")
def high_risk_privileged_access():
    """
    Return high and critical risk privileged accounts.
    """

    return get_high_risk_privileged_accounts()


@router.get("/mfa-disabled")
def mfa_disabled_privileged_access():
    """
    Return privileged accounts without MFA.
    """

    return get_mfa_disabled_privileged_accounts()