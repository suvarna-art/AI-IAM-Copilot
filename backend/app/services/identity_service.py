from typing import List

from app.data.identities import IDENTITIES
from app.models.identity import Identity


def get_all_identities() -> List[Identity]:
    """
    Return all enterprise identities.
    """

    return [
        Identity(**identity)
        for identity in IDENTITIES
    ]


def get_privileged_identities() -> List[Identity]:
    """
    Return identities that have privileged access.
    """

    return [
        identity
        for identity in get_all_identities()
        if identity.privileged
    ]


def get_inactive_identities() -> List[Identity]:
    """
    Return identities that are currently inactive.
    """

    return [
        identity
        for identity in get_all_identities()
        if identity.status.lower() == "inactive"
    ]


def get_excessive_access_identities(
    access_threshold: int = 15,
) -> List[Identity]:
    """
    Return identities whose access count exceeds
    the defined access threshold.
    """

    return [
        identity
        for identity in get_all_identities()
        if identity.access_count > access_threshold
    ]


def get_high_risk_identities() -> List[Identity]:
    """
    Return identities classified as high risk.
    """

    return [
        identity
        for identity in get_all_identities()
        if identity.risk_level.lower() == "high"
    ]