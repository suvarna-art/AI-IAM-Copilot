import hashlib
import os
from datetime import datetime, timezone
from threading import Lock

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


# ------------------------------------------------------------------
# Adaptive authentication runtime state
#
# Prototype implementation:
# - Failed attempts are maintained in process memory.
# - Known browser fingerprints are maintained in process memory.
#
# This is intentionally lightweight for the portfolio implementation.
# A production deployment would persist these signals in PostgreSQL,
# Redis, SIEM, or an external identity provider.
# ------------------------------------------------------------------

_failed_attempts: dict[str, int] = {}

_known_browser_fingerprints: set[str] = set()

_auth_state_lock = Lock()


def get_admin_credentials() -> tuple[str, str]:
    username = os.getenv(
        "ADMIN_USERNAME"
    )

    password_hash = os.getenv(
        "ADMIN_PASSWORD_HASH"
    )

    if not username or not password_hash:
        raise RuntimeError(
            "Admin authentication environment variables "
            "are not configured."
        )

    return username, password_hash


def build_browser_fingerprint(
    request: Request,
) -> str:
    """
    Create a privacy-conscious browser fingerprint using
    limited request metadata.

    Raw browser metadata is not stored.
    Only the SHA-256 digest is retained in memory.
    """

    user_agent = request.headers.get(
        "user-agent",
        "unknown",
    )

    accept_language = request.headers.get(
        "accept-language",
        "unknown",
    )

    fingerprint_source = (
        f"{user_agent}|{accept_language}"
    )

    return hashlib.sha256(
        fingerprint_source.encode(
            "utf-8"
        )
    ).hexdigest()


def is_unusual_login_hour() -> bool:
    """
    Prototype unusual-hour policy.

    Uses UTC because Render and most cloud runtimes
    operate consistently in UTC.

    00:00-05:59 UTC is treated as an unusual login window.

    This threshold is policy-driven rather than an
    assertion that the user is malicious.
    """

    current_hour = datetime.now(
        timezone.utc
    ).hour

    return 0 <= current_hour < 6


def get_failed_attempt_count(
    username: str,
) -> int:
    with _auth_state_lock:
        return _failed_attempts.get(
            username,
            0,
        )


def record_failed_attempt(
    username: str,
) -> int:
    with _auth_state_lock:
        current_count = (
            _failed_attempts.get(
                username,
                0,
            )
        )

        updated_count = (
            current_count + 1
        )

        _failed_attempts[
            username
        ] = updated_count

        return updated_count


def clear_failed_attempts(
    username: str,
) -> None:
    with _auth_state_lock:
        _failed_attempts.pop(
            username,
            None,
        )


def is_known_browser(
    browser_fingerprint: str,
) -> bool:
    with _auth_state_lock:
        return (
            browser_fingerprint
            in _known_browser_fingerprints
        )


def remember_browser(
    browser_fingerprint: str,
) -> None:
    with _auth_state_lock:
        _known_browser_fingerprints.add(
            browser_fingerprint
        )


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
            status_code=(
                status.HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=(
                "Authentication service "
                "is not configured."
            ),
        ) from exc


    browser_fingerprint = (
        build_browser_fingerprint(
            request
        )
    )


    failed_attempts_before_login = (
        get_failed_attempt_count(
            form_data.username
        )
    )


    known_browser = is_known_browser(
        browser_fingerprint
    )


    username_valid = (
        form_data.username
        == admin_username
    )


    password_valid = verify_password(
        form_data.password,
        admin_password_hash,
    )


    if (
        not username_valid
        or not password_valid
    ):
        record_failed_attempt(
            form_data.username
        )

        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Incorrect username or password."
            ),
            headers={
                "WWW-Authenticate":
                    "Bearer"
            },
        )


    # --------------------------------------------------------------
    # Build adaptive authentication context from runtime signals.
    # --------------------------------------------------------------

    session_context = SessionContext(
        new_browser=(
            not known_browser
        ),

        failed_attempts=(
            failed_attempts_before_login
        ),

        unusual_login_hour=(
            is_unusual_login_hour()
        ),

        known_session=(
            known_browser
        ),
    )


    decision = evaluate_access_decision(
        username=form_data.username,
        context=session_context,
    )


    # --------------------------------------------------------------
    # Authentication succeeded, but application authorization can
    # still independently DENY or require STEP_UP verification.
    # --------------------------------------------------------------

    if (
        decision.decision
        == AccessDecisionType.DENY
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_403_FORBIDDEN
            ),
            detail={
                "message":
                    "Application access denied.",

                "decision":
                    decision.model_dump(
                        mode="json"
                    ),
            },
        )


    if (
        decision.decision
        == AccessDecisionType.STEP_UP
    ):
        raise HTTPException(
            status_code=(
                status.HTTP_403_FORBIDDEN
            ),
            detail={
                "message": (
                    "Additional verification "
                    "is required before access "
                    "can be granted."
                ),

                "decision":
                    decision.model_dump(
                        mode="json"
                    ),
            },
        )


    # --------------------------------------------------------------
    # Access approved.
    #
    # Successful authentication clears accumulated failure signals
    # and teaches the runtime that this browser has been seen before.
    # --------------------------------------------------------------

    clear_failed_attempts(
        form_data.username
    )


    remember_browser(
        browser_fingerprint
    )


    token_role = (
        "admin"
        if (
            decision.decision
            == AccessDecisionType.ALLOW
        )
        else "auditor"
    )


    access_token = create_access_token(
        subject=form_data.username,
        role=token_role,
    )


    return {
        "access_token":
            access_token,

        "token_type":
            "bearer",

        "expires_in_minutes":
            30,

        "authorization": {
            "decision":
                decision.decision,

            "access_scope":
                decision.access_scope,

            "role":
                decision.role,

            "department":
                decision.department,

            "privileged":
                decision.privileged,

            "risk_level":
                decision.risk_level,

            "risk_score":
                decision.risk_score,

            "reason":
                decision.reason,

            "checks": [
                check.model_dump(
                    mode="json"
                )
                for check
                in decision.checks
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