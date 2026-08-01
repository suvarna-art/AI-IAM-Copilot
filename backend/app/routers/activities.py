from fastapi import APIRouter

router = APIRouter(
    prefix="/activities",
    tags=["Activities"]
)

@router.get("/")
def get_activities():
    return [
        {
            "id": 1,
            "user": "Alice Johnson",
            "action": "Requested Admin Access",
            "status": "Pending",
            "time": "2 min ago"
        },
        {
            "id": 2,
            "user": "Rahul Sharma",
            "action": "Password Reset",
            "status": "Completed",
            "time": "5 min ago"
        },
        {
            "id": 3,
            "user": "David Chen",
            "action": "Role Assignment",
            "status": "Success",
            "time": "12 min ago"
        },
        {
            "id": 4,
            "user": "Sophia Patel",
            "action": "Privileged Access Approved",
            "status": "Completed",
            "time": "25 min ago"
        }
    ]