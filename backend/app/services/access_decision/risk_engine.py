from app.services.access_decision.models import (
    IdentityProfile,
    RiskAssessment,
    RiskLevel,
    SessionContext,
)


def calculate_session_risk(
    identity: IdentityProfile,
    context: SessionContext,
) -> RiskAssessment:
    score = 0
    factors: list[str] = []

    # ---------------------------------------------------------
    # New / unfamiliar browser
    # ---------------------------------------------------------

    if context.new_browser:
        score += 10

        factors.append(
            "Authentication attempt originated from a new browser."
        )

    # ---------------------------------------------------------
    # Failed authentication attempts
    # ---------------------------------------------------------

    if context.failed_attempts >= 5:
        score += 40

        factors.append(
            "Five or more failed authentication attempts were observed."
        )

    elif context.failed_attempts >= 3:
        score += 20

        factors.append(
            "Multiple failed authentication attempts were observed."
        )

    elif context.failed_attempts > 0:
        score += 5

        factors.append(
            "A recent failed authentication attempt was observed."
        )

    # ---------------------------------------------------------
    # Unusual login time
    # ---------------------------------------------------------

    if context.unusual_login_hour:
        score += 10

        factors.append(
            "Authentication occurred outside the expected login period."
        )

    # ---------------------------------------------------------
    # Privileged identities receive additional scrutiny.
    #
    # This is NOT saying privileged users are malicious.
    # It reflects the higher impact of privileged compromise.
    # ---------------------------------------------------------

    if identity.privileged:
        score += 10

        factors.append(
            "Privileged identity requires elevated session assurance."
        )

    # ---------------------------------------------------------
    # Known trusted session reduces risk slightly.
    # ---------------------------------------------------------

    if context.known_session:
        score -= 10

        factors.append(
            "A previously known session reduced contextual risk."
        )

    score = max(
        0,
        min(score, 100),
    )

    if score >= 60:
        level = RiskLevel.HIGH

    elif score >= 30:
        level = RiskLevel.MEDIUM

    else:
        level = RiskLevel.LOW

    if not factors:
        factors.append(
            "No elevated session risk indicators were detected."
        )

    return RiskAssessment(
        score=score,
        level=level,
        factors=factors,
    )