from pydantic import BaseModel


class AccessControlResponse(BaseModel):
    identity_id: str
    username: str
    display_name: str
    department: str
    access_count: int
    privileged: bool
    risk_level: str
    access_status: str