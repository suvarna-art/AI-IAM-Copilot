from typing import List, Dict, Any

from app.data.roles import ROLES


def get_all_roles() -> List[Dict[str, Any]]:
    """
    Return all enterprise IAM roles.
    """

    return ROLES


def get_high_risk_roles() -> List[Dict[str, Any]]:
    """
    Return roles classified as high risk.
    """

    return [
        role
        for role in ROLES
        if role["riskLevel"].lower() == "high"
    ]