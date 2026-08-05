from fastapi import APIRouter

router = APIRouter()

@router.get("/risk-intelligence/")
def get_risk_intelligence():
    return {
        "overallRisk": "High",
        "riskScore": 92,
        "confidence": 97,
        "topFinding": "Multiple privileged accounts detected",
        "recommendations": [
            "Enable MFA",
            "Review privileged roles",
            "Disable inactive identities"
        ]
    }