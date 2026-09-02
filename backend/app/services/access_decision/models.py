from enum import Enum

from pydantic import BaseModel, Field


class AccessDecisionType(str, Enum):
    ALLOW = "ALLOW"
    READ_ONLY = "READ_ONLY"
    STEP_UP = "STEP_UP"
    DENY = "DENY"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class CheckStatus(str, Enum):
    PASS = "PASS"
    WARN = "WARN"
    FAIL = "FAIL"
    INFO = "INFO"


class IdentityProfile(BaseModel):
    username: str
    display_name: str
    department: str
    role: str
    account_status: str
    privileged: bool


class SessionContext(BaseModel):
    new_browser: bool = False

    failed_attempts: int = Field(
        default=0,
        ge=0,
    )

    unusual_login_hour: bool = False
    known_session: bool = False


class RiskAssessment(BaseModel):
    score: int
    level: RiskLevel

    factors: list[str] = Field(
        default_factory=list
    )


class DecisionCheck(BaseModel):
    name: str
    status: CheckStatus
    explanation: str


class AccessDecision(BaseModel):
    decision: AccessDecisionType

    identity: str
    display_name: str
    department: str
    role: str

    privileged: bool

    risk_score: int
    risk_level: RiskLevel

    access_scope: str

    checks: list[DecisionCheck]

    reason: str