from fastapi import APIRouter

router = APIRouter()


@router.get("/access-review")
def get_access_review():

    return {
        "completedReviews": 284,
        "pendingReviews": 16,
        "overdueReviews": 5,
        "completionRate": 95,
        "nextCampaign": "Q3 Finance Review"
    }