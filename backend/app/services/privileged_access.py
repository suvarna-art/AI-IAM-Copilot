from typing import List, Dict, Any

from app.data.privileged_access import PRIVILEGED_ACCOUNTS


def get_all_privileged_accounts() -> List[Dict[str, Any]]:
    """
    Return all privileged accounts.
    """

    return PRIVILEGED_ACCOUNTS


def get_high_risk_privileged_accounts() -> List[Dict[str, Any]]:
    """
    Return privileged accounts classified as high or critical risk.
    """

    return [
        account
        for account in PRIVILEGED_ACCOUNTS
        if account["riskLevel"].lower() in {"high", "critical"}
    ]


def get_mfa_disabled_privileged_accounts() -> List[Dict[str, Any]]:
    """
    Return privileged accounts that do not have MFA enabled.
    """

    return [
        account
        for account in PRIVILEGED_ACCOUNTS
        if not account["mfaEnabled"]
    ]