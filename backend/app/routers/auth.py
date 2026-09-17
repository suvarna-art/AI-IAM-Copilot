import hashlib
import os
import logging
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
from app.security.audit import (
    write_security_audit_event,
)

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

logger = logging.getLogger(
    "identityforge.auth"
)


# ------------------------------------------------------------------
# Adaptive authentication runtime state
#
# Prototype implementation:
# - Failed attempts are maintained in process memory.
# - Known browser fingerprints are maintained in process memory.
#
# A future enterprise implementation can persist these signals in
# PostgreSQL, Redis, SIEM, or an external identity provider.
# ------------------------------------------------------------------

_failed_attempts: dict[str, int] = {}

_known_browser_fingerprints: set[str] = set()

_auth_state_lock = Lock()


# ------------------------------------------------------------------
# ADMIN CREDENTIAL CONFIGURATION
# ------------------------------------------------------------------

def get_admin_credentials() -> tuple[str, str]:
    username = os.getenv(
        "ADMIN_USERNAME"
    )

    password_hash = os.getenv(
        "ADMIN_PASSWORD_HASH"
    )

    logger.warning(
        "AUTH_RUNTIME_CHECK "
        "admin_username_present=%s "
        "admin_password_hash_present=%s",
        bool(username),
        bool(password_hash),
    )

    if not username or not password_hash:
        raise RuntimeError(
            "Admin authentication environment variables "
            "are not configured."
        )

    return username, password_hash

# ------------------------------------------------------------------
# BROWSER / SESSION CONTEXT
# ------------------------------------------------------------------

def build_browser_fingerprint(
    request: Request,
) -> str:
    """
    Create a privacy-conscious browser fingerprint from
    limited request metadata.

    Raw browser metadata is not persisted.
    Only the SHA-256 digest is retained in process memory.
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

    UTC 00:00-05:59 is treated as an unusual login window.
    This is a policy signal, not an assertion of malicious activity.
    """

    current_hour = datetime.now(
        timezone.utc
    ).hour

    return 0 <= current_hour < 6


# ------------------------------------------------------------------
# FAILED LOGIN STATE
# ------------------------------------------------------------------

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


# ------------------------------------------------------------------
# KNOWN BROWSER STATE
# ------------------------------------------------------------------

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


# ------------------------------------------------------------------
# LOGIN
# ------------------------------------------------------------------

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


    # --------------------------------------------------------------
    # AUTHENTICATION FAILURE
    # --------------------------------------------------------------

    if (
        not username_valid
        or not password_valid
    ):
        failed_attempt_count = (
            record_failed_attempt(
                form_data.username
            )
        )

        write_security_audit_event(
            event_type="AUTH_FAILURE",
            actor=form_data.username,
            actor_role=None,
            resource="IdentityForge AI",
            action="LOGIN",
            outcome="FAILURE",
            reason="Invalid credentials.",
            metadata={
                "failed_attempts":
                    failed_attempt_count,
                "known_browser":
                    known_browser,
            },
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
    # BUILD ADAPTIVE AUTHENTICATION CONTEXT
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
    # ACCESS DENY
    # --------------------------------------------------------------

    if (
        decision.decision
        == AccessDecisionType.DENY
    ):
        write_security_audit_event(
            event_type="ACCESS_DENY",
            actor=form_data.username,
            actor_role=decision.role,
            resource="IdentityForge AI",
            action="LOGIN",
            outcome="DENIED",
            decision=decision.decision.value,
            risk_level=decision.risk_level.value,
            risk_score=decision.risk_score,
            reason=decision.reason,
            metadata={
                "privileged":
                    decision.privileged,
                "failed_attempts":
                    failed_attempts_before_login,
                "known_browser":
                    known_browser,
            },
        )

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


    # --------------------------------------------------------------
    # STEP-UP REQUIRED
    # --------------------------------------------------------------

    if (
        decision.decision
        == AccessDecisionType.STEP_UP
    ):
        write_security_audit_event(
            event_type="ACCESS_STEP_UP",
            actor=form_data.username,
            actor_role=decision.role,
            resource="IdentityForge AI",
            action="LOGIN",
            outcome="STEP_UP_REQUIRED",
            decision=decision.decision.value,
            risk_level=decision.risk_level.value,
            risk_score=decision.risk_score,
            reason=decision.reason,
            metadata={
                "privileged":
                    decision.privileged,
                "failed_attempts":
                    failed_attempts_before_login,
                "known_browser":
                    known_browser,
            },
        )

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
    # ACCESS APPROVED
    #
    # Authentication succeeded and authorization allows an
    # application session.
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


    # --------------------------------------------------------------
    # SUCCESSFUL SESSION AUDIT
    #
    # The JWT itself is intentionally never written to audit logs.
    # --------------------------------------------------------------

    write_security_audit_event(
        event_type="AUTH_SUCCESS",
        actor=form_data.username,
        actor_role=decision.role,
        resource="IdentityForge AI",
        action="LOGIN",
        outcome="SUCCESS",
        decision=decision.decision.value,
        risk_level=decision.risk_level.value,
        risk_score=decision.risk_score,
        reason=decision.reason,
        metadata={
            "privileged":
                decision.privileged,
            "access_scope":
                decision.access_scope,
            "known_browser":
                known_browser,
        },
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


# ------------------------------------------------------------------
# CURRENT AUTHENTICATED USER
# ------------------------------------------------------------------

@router.get("/me")
def get_authenticated_user(
    current_user: dict = Depends(
        get_current_user
    ),
):
    return current_user