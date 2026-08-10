from typing import Dict, Any


def get_analytics() -> Dict[str, Any]:
    """
    Return enterprise IAM analytics data.
    """

    return {
        "summary": {
            "totalIdentities": 10,
            "activeIdentities": 7,
            "privilegedIdentities": 3,
            "highRiskIdentities": 3,
            "inactiveIdentities": 3,
            "excessiveAccessIdentities": 4,
        },

        "riskDistribution": [
            {
                "name": "Low",
                "value": 4,
            },
            {
                "name": "Medium",
                "value": 3,
            },
            {
                "name": "High",
                "value": 3,
            },
        ],

        "identityStatus": [
            {
                "name": "Active",
                "value": 7,
            },
            {
                "name": "Inactive",
                "value": 3,
            },
        ],

        "accessTrend": [
            {
                "period": "Jan",
                "accessRequests": 42,
                "approved": 35,
                "denied": 7,
            },
            {
                "period": "Feb",
                "accessRequests": 51,
                "approved": 43,
                "denied": 8,
            },
            {
                "period": "Mar",
                "accessRequests": 47,
                "approved": 39,
                "denied": 8,
            },
            {
                "period": "Apr",
                "accessRequests": 63,
                "approved": 54,
                "denied": 9,
            },
            {
                "period": "May",
                "accessRequests": 58,
                "approved": 49,
                "denied": 9,
            },
            {
                "period": "Jun",
                "accessRequests": 71,
                "approved": 61,
                "denied": 10,
            },
        ],

        "securityMetrics": {
            "securityScore": 94,
            "accessReviewCompletion": 95,
            "privilegedAccountPercentage": 30,
            "highRiskPercentage": 30,
        },
    }