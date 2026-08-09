from typing import List

from app.data.access_control import ACCESS_THRESHOLD
from app.models.access_control import AccessControl
from app.services.identity_service import get_all_identities


def get_all_access_controls() -> List[AccessControl]:
    """
    Return access-control intelligence for all identities.
    """

    identities = get_all_identities()

    return [
        AccessControl(
            identity_id=identity.id,
            username=identity.username,
            display_name=identity.display_name,
            department=identity.department,
            access_count=identity.access_count,
            privileged=identity.privileged,
            risk_level=identity.risk_level,
            access_status=(
                "Excessive"
                if identity.access_count > ACCESS_THRESHOLD
                else "Normal"
            ),
        )
        for identity in identities
    ]


def get_privileged_access_controls() -> List[AccessControl]:
    """
    Return identities with privileged access.
    """

    return [
        access
        for access in get_all_access_controls()
        if access.privileged
    ]


def get_high_risk_access_controls() -> List[AccessControl]:
    """
    Return identities with high-risk access.
    """

    return [
        access
        for access in get_all_access_controls()
        if access.risk_level.lower() == "high"
    ]


def get_excessive_access_controls() -> List[AccessControl]:
    """
    Return identities whose access count exceeds
    the configured access threshold.
    """

    return [
        access
        for access in get_all_access_controls()
        if access.access_count > ACCESS_THRESHOLD
    ]