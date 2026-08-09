PRIVILEGED_KEYWORDS = (
    "privileged access",
    "privileged identity",
    "privileged identities",
    "privileged user",
    "privileged users",
    "admin user",
    "admin users",
    "administrator",
    "administrators",
    "administrative user",
    "administrative users",
    "elevated access",
    "elevated privileges",
    "elevated privilege",
)

INACTIVE_KEYWORDS = (
    "inactive user",
    "inactive users",
    "inactive identity",
    "inactive identities",
    "inactive account",
    "inactive accounts",
    "dormant user",
    "dormant users",
    "dormant identity",
    "dormant identities",
    "dormant account",
    "dormant accounts",
)

EXCESSIVE_ACCESS_KEYWORDS = (
    "excessive access",
    "too much access",
    "over privileged",
    "overprivileged",
    "over-privileged",
    "excess permissions",
    "too many permissions",
    "too much permission",
    "excessive permissions",
)

from app.services.identity_service import (
    get_privileged_identities,
    get_inactive_identities,
    get_excessive_access_identities,
)

def build_identity_summary(
    identities,
    category: str,
) -> str:
    """
    Build a concise natural-language summary from identity records.
    """

    if not identities:
        return (
            f"No {category} identities were identified "
            "in the current identity dataset."
        )

    names = ", ".join(
        identity.display_name
        for identity in identities
    )

    return (
        f"I identified {len(identities)} {category} "
        f"identities: {names}."
    )


def build_privileged_response(
    prompt: str,
    identities,
) -> str:
    """
    Build a context-aware response for privileged identity questions.
    """

    normalized_prompt = prompt.lower().strip()

    summary = build_identity_summary(
        identities,
        "privileged",
    )

    if (
        "administrator" in normalized_prompt
        or "admin" in normalized_prompt
    ):
        return (
            f"{summary} "
            "These identities have administrative-level access "
            "and should be reviewed for business justification."
        )

    if (
        "risk" in normalized_prompt
        or "danger" in normalized_prompt
        or "risky" in normalized_prompt
    ):
        return (
            f"{summary} "
            "Privileged access represents elevated identity risk "
            "because compromised administrative accounts can have "
            "a significant impact on enterprise systems."
        )

    return (
        f"{summary} "
        "Privileged identities should be reviewed closely "
        "to verify that elevated access is business justified."
    )


def process_copilot_prompt(prompt: str) -> dict:
    """
    Process an IAM Copilot prompt.

    Deterministic IAM intelligence for the current prototype.
    The service uses the Identity Intelligence service for
    identity-level analysis.

    An AI/LLM provider can later be integrated without changing
    the API contract.
    """

    normalized_prompt = prompt.lower().strip()

    # =========================================================
    # 1. PRIVILEGED IDENTITY QUESTIONS
    # =========================================================

    if any(
    keyword in normalized_prompt
    for keyword in PRIVILEGED_KEYWORDS
    ):
        identities = get_privileged_identities()

        answer = build_privileged_response(normalized_prompt,identities,
        )

        return {
            "answer": answer,
            "intent": "privileged_identities",
            "risk_level": "High",
            "recommendations": [
                "Review all privileged identities",
                "Verify privileged roles are business justified",
                "Enforce MFA for privileged accounts",
                "Apply least-privilege controls",
            ],
        }

    # =========================================================
    # 2. INACTIVE IDENTITY QUESTIONS
    # =========================================================

    if any(
    keyword in normalized_prompt
    for keyword in INACTIVE_KEYWORDS
    ):
        identities = get_inactive_identities()

        if identities:
            identity_details = "; ".join(
                f"{identity.display_name} ({identity.department})"
                for identity in identities
            )

            answer = (
                f"I found {len(identities)} inactive identities: "
                f"{identity_details}. "
                "These accounts should be investigated and disabled "
                "when there is no legitimate business requirement."
            )
        else:
            answer = (
                "No inactive identities were identified in the "
                "current identity dataset."
            )

        return {
            "answer": answer,
            "intent": "inactive_identities",
            "risk_level": "Medium",
            "recommendations": [
                "Identify identities with prolonged inactivity",
                "Disable accounts with no business justification",
                "Remove unnecessary access from inactive identities",
                "Include inactive accounts in access reviews",
            ],
        }

    # =========================================================
    # 3. EXCESSIVE ACCESS QUESTIONS
    # =========================================================

    if any(
    keyword in normalized_prompt
    for keyword in EXCESSIVE_ACCESS_KEYWORDS
    ):
        identities = get_excessive_access_identities()

        if identities:
            identity_details = "; ".join(
                f"{identity.display_name} ({identity.access_count} access grants)"
                for identity in identities
            )

            answer = (
                f"I found {len(identities)} identities with excessive "
                f"access based on the current access threshold: "
                f"{identity_details}. "
                "These identities should be reviewed against "
                "least-privilege requirements."
            )
        else:
            answer = (
                "No identities currently exceed the configured "
                "access threshold."
            )

        return {
            "answer": answer,
            "intent": "excessive_access",
            "risk_level": "High",
            "recommendations": [
                "Review identities with excessive permissions",
                "Remove unnecessary roles and entitlements",
                "Apply least-privilege access",
                "Perform periodic access certification",
            ],
        }

    # =========================================================
    # 4. ACCESS REVIEW / GOVERNANCE
    # =========================================================

    if (
        "access review" in normalized_prompt
        or "access reviews" in normalized_prompt
        or "certification" in normalized_prompt
        or "certifications" in normalized_prompt
        or "overdue review" in normalized_prompt
        or "pending review" in normalized_prompt
    ):
        return {
            "answer": (
                "There are currently 16 pending access reviews and "
                "5 overdue reviews. The overdue reviews require "
                "immediate governance attention."
            ),
            "intent": "access_review",
            "risk_level": "High",
            "recommendations": [
                "Review the 5 overdue certifications",
                "Prioritize privileged-access reviews",
                "Complete the 16 pending certifications",
            ],
        }

    # =========================================================
    # 5. GENERAL IDENTITY QUESTIONS
    # =========================================================

    if (
        "identity" in normalized_prompt
        or "identities" in normalized_prompt
        or "user" in normalized_prompt
        or "users" in normalized_prompt
        or "account" in normalized_prompt
        or "accounts" in normalized_prompt
    ):
        return {
            "answer": (
                "The Copilot identified this as an identity-security "
                "query. Identity intelligence currently covers "
                "privileged access, inactive identities, and "
                "excessive-access analysis."
            ),
            "intent": "identity_intelligence",
            "risk_level": "Medium",
            "recommendations": [
                "Review identity status",
                "Check privileged access",
                "Identify inactive identities",
                "Review excessive permissions",
            ],
        }

    # =========================================================
    # 6. RISK INTELLIGENCE
    # =========================================================

    if (
        "risk" in normalized_prompt
        or "risk score" in normalized_prompt
        or "overall risk" in normalized_prompt
        or "security risk" in normalized_prompt
    ):
        return {
            "answer": (
                "The current enterprise risk assessment is High, "
                "with a risk score of 92%. Multiple privileged "
                "accounts have been detected."
            ),
            "intent": "risk_intelligence",
            "risk_level": "High",
            "recommendations": [
                "Enable MFA",
                "Review privileged roles",
                "Disable inactive identities",
            ],
        }

    # =========================================================
    # 7. FALLBACK
    # =========================================================

    return {
        "answer": (
            "I understand this as an IAM security question, but "
            "I need more context to provide a specific recommendation."
        ),
        "intent": "general_iam",
        "risk_level": "Unknown",
        "recommendations": [
            "Ask about identities",
            "Ask about privileged access",
            "Ask about inactive users",
            "Ask about excessive access",
            "Ask about access reviews",
            "Ask about risk",
        ],
    }