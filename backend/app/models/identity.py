from dataclasses import dataclass


@dataclass
class Identity:
    id: str
    username: str
    display_name: str
    email: str
    department: str
    status: str
    privileged: bool
    risk_level: str
    access_count: int