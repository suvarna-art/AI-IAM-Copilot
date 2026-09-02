import json
from pathlib import Path

from app.services.access_decision.models import (
    AccessDecision,
    AccessDecisionType,
    CheckStatus,
    DecisionCheck,
    IdentityProfile,
    RiskLevel,
    SessionContext,
)

from app.services.access_decision.risk_engine import (
    calculate_session_risk,
)


APP_DIR = Path(
    __file__
).resolve().parents[2]

IDENTITIES_FILE = (
    APP_DIR
    / "data"
    / "auth"
    / "demo_identities.json"
)


ADMIN_ROLES = {
    "IAM_ADMIN",
    "SECURITY_ADMIN",
}

READ_ONLY_ROLES = {
    "AUDITOR",
}


def load_demo_identities() -> list[IdentityProfile]:
    if not IDENTITIES_FILE.exists():
        raise RuntimeError(
            "Demo identity source is unavailable."
        )

    with open(
        IDENTITIES_FILE,
        "r",
        encoding="utf-8",
    ) as file:
        data = json.load(file)

    return [
        IdentityProfile(**item)
        for item in data
    ]


def find_identity_profile(
    username: str,
) -> IdentityProfile | None:
    normalized_username = (
        username.strip().lower()
    )

    for identity in load_demo_identities():
        if (
            identity.username.lower()
            == normalized_username
        ):
            return identity

    return None


def evaluate_access_decision(
    username: str,
    context: SessionContext,
) -> AccessDecision:
    identity = find_identity_profile(
        username
    )

    if identity is None:
        return AccessDecision(
            decision=AccessDecisionType.DENY,
            identity=username,
            display_name="Unknown Identity",
            department="UNKNOWN",
            role="UNKNOWN",
            privileged=False,
            risk_score=0,
            risk_level=RiskLevel.LOW,
            access_scope="NONE",
            checks=[
                DecisionCheck(
                    name="Identity resolved",
                    status=CheckStatus.FAIL,
                    explanation=(
                        "IdentityForge could not resolve "
                        "the supplied enterprise identity."
                    ),
                )
            ],
            reason=(
                "Access denied because the enterprise "
                "identity could not be resolved."
            ),
        )

    checks: list[DecisionCheck] = []

    # =========================================================
    # CHECK 1 — Identity resolution
    # =========================================================

    checks.append(
        DecisionCheck(
            name="Identity resolved",
            status=CheckStatus.PASS,
            explanation=(
                f"Enterprise identity {identity.username} "
                "was successfully resolved."
            ),
        )
    )

    # =========================================================
    # CHECK 2 — Account status
    # =========================================================

    if identity.account_status.upper() != "ACTIVE":
        checks.append(
            DecisionCheck(
                name="Account status",
                status=CheckStatus.FAIL,
                explanation=(
                    "The enterprise account is not active."
                ),
            )
        )

        return AccessDecision(
            decision=AccessDecisionType.DENY,
            identity=identity.username,
            display_name=identity.display_name,
            department=identity.department,
            role=identity.role,
            privileged=identity.privileged,
            risk_score=0,
            risk_level=RiskLevel.LOW,
            access_scope="NONE",
            checks=checks,
            reason=(
                "Access denied because the enterprise "
                "account is not active."
            ),
        )

    checks.append(
        DecisionCheck(
            name="Account status",
            status=CheckStatus.PASS,
            explanation=(
                "Enterprise account status is ACTIVE."
            ),
        )
    )

    # =========================================================
    # CHECK 3 — RBAC
    # =========================================================

    if identity.role in ADMIN_ROLES:
        role_scope = "ADMINISTRATIVE"

        checks.append(
            DecisionCheck(
                name="RBAC policy",
                status=CheckStatus.PASS,
                explanation=(
                    f"{identity.role} is authorized "
                    "for IdentityForge administrative access."
                ),
            )
        )

    elif identity.role in READ_ONLY_ROLES:
        role_scope = "READ_ONLY"

        checks.append(
            DecisionCheck(
                name="RBAC policy",
                status=CheckStatus.PASS,
                explanation=(
                    f"{identity.role} is authorized "
                    "for audit and read-only access."
                ),
            )
        )

    else:
        role_scope = "NONE"

        checks.append(
            DecisionCheck(
                name="RBAC policy",
                status=CheckStatus.FAIL,
                explanation=(
                    f"{identity.role} is not an approved "
                    "IdentityForge application role."
                ),
            )
        )

    # =========================================================
    # CHECK 4 — SoD / application boundary
    # =========================================================

    if role_scope == "NONE":
        checks.append(
            DecisionCheck(
                name="Segregation of duties",
                status=CheckStatus.FAIL,
                explanation=(
                    "The user's business role is outside "
                    "the IAM and security administration "
                    "boundary for IdentityForge."
                ),
            )
        )

        return AccessDecision(
            decision=AccessDecisionType.DENY,
            identity=identity.username,
            display_name=identity.display_name,
            department=identity.department,
            role=identity.role,
            privileged=identity.privileged,
            risk_score=0,
            risk_level=RiskLevel.LOW,
            access_scope="NONE",
            checks=checks,
            reason=(
                "Identity authenticated conceptually, "
                "but application authorization was denied "
                "because the assigned enterprise role does "
                "not satisfy the IdentityForge access policy."
            ),
        )

    checks.append(
        DecisionCheck(
            name="Segregation of duties",
            status=CheckStatus.PASS,
            explanation=(
                "The assigned role satisfies the "
                "IdentityForge application-access boundary."
            ),
        )
    )

    # =========================================================
    # CHECK 5 — Session risk
    # =========================================================

    risk = calculate_session_risk(
        identity=identity,
        context=context,
    )

    if risk.level == RiskLevel.HIGH:
        checks.append(
            DecisionCheck(
                name="Session risk",
                status=CheckStatus.FAIL,
                explanation=(
                    f"Contextual session risk is HIGH "
                    f"with score {risk.score}/100."
                ),
            )
        )

        return AccessDecision(
            decision=AccessDecisionType.DENY,
            identity=identity.username,
            display_name=identity.display_name,
            department=identity.department,
            role=identity.role,
            privileged=identity.privileged,
            risk_score=risk.score,
            risk_level=risk.level,
            access_scope="NONE",
            checks=checks,
            reason=(
                "Authentication context exceeded the "
                "acceptable risk threshold. Access was denied."
            ),
        )

    if risk.level == RiskLevel.MEDIUM:
        checks.append(
            DecisionCheck(
                name="Session risk",
                status=CheckStatus.WARN,
                explanation=(
                    f"Contextual session risk is MEDIUM "
                    f"with score {risk.score}/100."
                ),
            )
        )

        return AccessDecision(
            decision=AccessDecisionType.STEP_UP,
            identity=identity.username,
            display_name=identity.display_name,
            department=identity.department,
            role=identity.role,
            privileged=identity.privileged,
            risk_score=risk.score,
            risk_level=risk.level,
            access_scope="STEP_UP_REQUIRED",
            checks=checks,
            reason=(
                "The identity and role are authorized, "
                "but additional verification is required "
                "because contextual session risk is elevated."
            ),
        )

    checks.append(
        DecisionCheck(
            name="Session risk",
            status=CheckStatus.PASS,
            explanation=(
                f"Contextual session risk is LOW "
                f"with score {risk.score}/100."
            ),
        )
    )

    # =========================================================
    # FINAL AUTHORIZATION
    # =========================================================

    if role_scope == "READ_ONLY":
        return AccessDecision(
            decision=AccessDecisionType.READ_ONLY,
            identity=identity.username,
            display_name=identity.display_name,
            department=identity.department,
            role=identity.role,
            privileged=identity.privileged,
            risk_score=risk.score,
            risk_level=risk.level,
            access_scope="READ_ONLY",
            checks=checks,
            reason=(
                "Access granted with read-only scope "
                "based on the user's audit role."
            ),
        )

    return AccessDecision(
        decision=AccessDecisionType.ALLOW,
        identity=identity.username,
        display_name=identity.display_name,
        department=identity.department,
        role=identity.role,
        privileged=identity.privileged,
        risk_score=risk.score,
        risk_level=risk.level,
        access_scope="ADMINISTRATIVE",
        checks=checks,
        reason=(
            "Access granted because identity, account status, "
            "RBAC, segregation-of-duties policy, and contextual "
            "risk requirements were satisfied."
        ),
    )