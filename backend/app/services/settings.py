from typing import Dict, Any


def get_settings() -> Dict[str, Any]:
    """
    Return enterprise IAM application settings.
    """

    return {
        "organization": {
            "name": "IdentityForge AI",
            "environment": "Production",
            "region": "Global",
        },
        "security": {
            "mfaEnabled": True,
            "ssoEnabled": True,
            "sessionTimeoutMinutes": 30,
            "passwordPolicy": "Strong",
            "riskMonitoring": True,
        },
        "governance": {
            "accessReviewsEnabled": True,
            "reviewFrequency": "Quarterly",
            "privilegedAccessMonitoring": True,
            "auditLogging": True,
        },
        "ai": {
            "copilotEnabled": True,
            "riskAnalysisEnabled": True,
            "recommendationsEnabled": True,
        },
    }