import os

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm

from app.security.auth import (
    create_access_token,
    verify_password,
)
from app.security.dependencies import get_current_user
from app.security.rate_limit import limiter

from app.services.access_decision.models import (
    AccessDecisionType,
    SessionContext,
)

from app.services.access_decision.policy_engine import (
    evaluate_access_decision,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


def get_admin_credentials() -> tuple[str, str]:
    username = os.getenv("ADMIN_USERNAME")
    password_hash = os.getenv("ADMIN_PASSWORD_HASH")

    if not username or not password_hash:
        raise RuntimeError(
            "Admin authentication environment variables are not configured."
        )

    return username, password_hash


@router.post("/login")
@limiter.limit("5/minute")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    try:
        admin_username, admin_password_hash = (
            get_admin_credentials()
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is not configured.",
        ) from exc

    username_valid = (
        form_data.username == admin_username
    )

    password_valid = verify_password(
        form_data.password,
        admin_password_hash,
    )

    if not username_valid or not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    session_context = SessionContext(
        new_browser=False,
        failed_attempts=0,
        unusual_login_hour=False,
        known_session=True,
    )

    decision = evaluate_access_decision(
        username=form_data.username,
        context=session_context,
    )

    if decision.decision == AccessDecisionType.DENY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": "Application access denied.",
                "decision": decision.model_dump(
                    mode="json"
                ),
            },
        )

    if decision.decision == AccessDecisionType.STEP_UP:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": (
                    "Additional verification is required "
                    "before access can be granted."
                ),
                "decision": decision.model_dump(
                    mode="json"
                ),
            },
        )

    token_role = (
        "admin"
        if decision.decision
        == AccessDecisionType.ALLOW
        else "auditor"
    )

    access_token = create_access_token(
        subject=form_data.username,
        role=token_role,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in_minutes": 30,

        "authorization": {
            "decision": decision.decision,
            "access_scope": decision.access_scope,
            "role": decision.role,
            "department": decision.department,
            "privileged": decision.privileged,
            "risk_level": decision.risk_level,
            "risk_score": decision.risk_score,
            "reason": decision.reason,
            "checks": [
                check.model_dump(
                    mode="json"
                )
                for check in decision.checks
            ],
        },
    }


@router.get("/me")
def get_authenticated_user(
    current_user: dict = Depends(
        get_current_user
    ),
):
    return current_user