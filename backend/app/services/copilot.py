def process_copilot_prompt(prompt: str) -> dict:
    """
    Process an IAM Copilot prompt.

    This first implementation uses deterministic IAM intelligence.
    An AI/LLM provider can be integrated into this service later
    without changing the API contract.
    """

    normalized_prompt = prompt.lower().strip()

    # Governance / Access Review
    if (
        "access review" in normalized_prompt
        or "access reviews" in normalized_prompt
        or "review" in normalized_prompt
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

    # Risk intelligence
    if (
        "risk" in normalized_prompt
        or "high risk" in normalized_prompt
        or "privileged" in normalized_prompt
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

    # Identity-related questions
    if (
        "identity" in normalized_prompt
        or "identities" in normalized_prompt
        or "user" in normalized_prompt
        or "users" in normalized_prompt
    ):
        return {
            "answer": (
                "The Copilot identified this as an identity-security "
                "query. Identity-level analysis will be expanded in "
                "the next Copilot capability."
            ),
            "intent": "identity_intelligence",
            "risk_level": "Medium",
            "recommendations": [
                "Review identity status",
                "Check excessive access",
                "Review inactive identities",
            ],
        }

    # Fallback
    return {
        "answer": (
            "I understand this as an IAM security question, but I "
            "need more context to provide a specific recommendation."
        ),
        "intent": "general_iam",
        "risk_level": "Unknown",
        "recommendations": [
            "Ask about identities",
            "Ask about access reviews",
            "Ask about risk or privileged access",
        ],
    }