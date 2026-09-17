import logging
import os

from dotenv import load_dotenv


# =========================================================
# ENVIRONMENT INITIALIZATION
# =========================================================

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s "
        "%(levelname)s "
        "%(name)s "
        "%(message)s"
    ),
)

logger = logging.getLogger(
    "identityforge.startup"
)


ENVIRONMENT = os.getenv(
    "ENVIRONMENT",
    "development",
).lower()

IS_PRODUCTION = (
    ENVIRONMENT == "production"
)


logger.warning(
    "STARTUP_CONFIG_CHECK "
    "environment=%s "
    "admin_username_present=%s "
    "admin_password_hash_present=%s "
    "jwt_secret_key_present=%s "
    "database_url_present=%s "
    "cors_origins_present=%s",
    ENVIRONMENT,
    bool(
        os.getenv(
            "ADMIN_USERNAME"
        )
    ),
    bool(
        os.getenv(
            "ADMIN_PASSWORD_HASH"
        )
    ),
    bool(
        os.getenv(
            "JWT_SECRET_KEY"
        )
    ),
    bool(
        os.getenv(
            "DATABASE_URL"
        )
    ),
    bool(
        os.getenv(
            "BACKEND_CORS_ORIGINS"
        )
    ),
)


# =========================================================
# FRAMEWORK IMPORTS
# =========================================================

from fastapi import FastAPI
from fastapi.middleware.cors import (
    CORSMiddleware,
)

from slowapi import (
    _rate_limit_exceeded_handler,
)
from slowapi.errors import (
    RateLimitExceeded,
)


# =========================================================
# APPLICATION IMPORTS
# =========================================================

from app.security.rate_limit import (
    limiter,
)

from app.routers.dashboard import (
    router as dashboard_router,
)
from app.routers.activities import (
    router as activities_router,
)
from app.routers.ai_confidence import (
    router as ai_confidence_router,
)

from app.routers import (
    analytics,
    copilot,
    identities,
    privileged_access,
    risk_intelligence,
    roles,
    settings,
)

from app.api import (
    access_control,
    access_review,
)

from app.routers.auth import (
    router as auth_router,
)

from app.routers.permission_drift.permission_drift import (
    router as permission_drift_router,
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

cors_origins = os.getenv(
    "BACKEND_CORS_ORIGINS",
    "http://localhost:5173",
).split(",")

cors_origins = [
    origin.strip()
    for origin in cors_origins
    if origin.strip()
]


# =========================================================
# APPLICATION
# =========================================================

app = FastAPI(
    title="IdentityForge AI",
    version="1.0.0",

    docs_url=(
        None
        if IS_PRODUCTION
        else "/docs"
    ),

    redoc_url=(
        None
        if IS_PRODUCTION
        else "/redoc"
    ),

    openapi_url=(
        None
        if IS_PRODUCTION
        else "/openapi.json"
    ),
)


app.state.limiter = limiter


app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# SECURITY HEADERS
# =========================================================

@app.middleware("http")
async def add_security_headers(
    request,
    call_next,
):
    response = await call_next(
        request
    )

    response.headers[
        "X-Content-Type-Options"
    ] = "nosniff"

    response.headers[
        "X-Frame-Options"
    ] = "DENY"

    response.headers[
        "Referrer-Policy"
    ] = "no-referrer"

    response.headers[
        "Permissions-Policy"
    ] = (
        "camera=(), "
        "microphone=(), "
        "geolocation=(), "
        "payment=(), "
        "usb=()"
    )

    if (
        not IS_PRODUCTION
        and request.url.path
        in {
            "/docs",
            "/redoc",
        }
    ):
        response.headers[
            "Content-Security-Policy"
        ] = (
            "default-src 'self' https:; "
            "script-src 'self' "
            "'unsafe-inline' https:; "
            "style-src 'self' "
            "'unsafe-inline' https:; "
            "img-src 'self' data: https:; "
            "font-src 'self' data: https:; "
            "frame-ancestors 'none';"
        )

    else:
        response.headers[
            "Content-Security-Policy"
        ] = (
            "default-src 'none'; "
            "frame-ancestors 'none'; "
            "base-uri 'none'; "
            "form-action 'none'"
        )

    if IS_PRODUCTION:
        response.headers[
            "Strict-Transport-Security"
        ] = (
            "max-age=31536000; "
            "includeSubDomains"
        )

    return response


# =========================================================
# APPLICATION ROUTERS
# =========================================================

app.include_router(
    dashboard_router
)

app.include_router(
    activities_router
)

app.include_router(
    ai_confidence_router
)

app.include_router(
    risk_intelligence.router
)

app.include_router(
    access_review.router
)

app.include_router(
    access_control.router
)

app.include_router(
    copilot.router
)

app.include_router(
    identities.router
)

app.include_router(
    analytics.router
)

app.include_router(
    settings.router
)

app.include_router(
    roles.router
)

app.include_router(
    privileged_access.router
)

app.include_router(
    permission_drift_router
)

app.include_router(
    auth_router
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "company":
            "IdentityForge AI",

        "product":
            "AI-IAM Copilot",

        "message":
            "Forging the Future of Identity Security",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }