import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.dashboard import router as dashboard_router
from app.routers.activities import router as activities_router
from app.routers.ai_confidence import router as ai_confidence_router

from app.routers import risk_intelligence
from app.routers import copilot
from app.routers import identities
from app.routers import analytics
from app.api import access_review
from app.api import access_control
from app.routers import settings
from app.routers import roles
from app.routers import privileged_access
from app.routers.auth import router as auth_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.security.rate_limit import limiter
from app.routers.permission_drift.permission_drift import (
    router as permission_drift_router,
)


load_dotenv()


cors_origins = os.getenv(
    "BACKEND_CORS_ORIGINS",
    "http://localhost:5173",
).split(",")

cors_origins = [
    origin.strip()
    for origin in cors_origins
    if origin.strip()
]


import os

from fastapi import FastAPI


ENVIRONMENT = os.getenv(
    "ENVIRONMENT",
    "development",
).lower()

IS_PRODUCTION = (
    ENVIRONMENT == "production"
)


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
async def add_security_headers(request, call_next):
    response = await call_next(request)

    # Prevent MIME-type sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"

    # Prevent the API from being embedded in frames
    response.headers["X-Frame-Options"] = "DENY"

    # Avoid leaking referrer information
    response.headers["Referrer-Policy"] = "no-referrer"

    # Disable unnecessary browser capabilities
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=(), "
        "payment=(), usb=()"
    )

    # API-focused CSP: this backend should not render browser content
    response.headers["Content-Security-Policy"] = (
        "default-src 'none'; "
        "frame-ancestors 'none'; "
        "base-uri 'none'; "
        "form-action 'none'"
    )

    # HSTS should only be enabled in production over HTTPS
    if IS_PRODUCTION:
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )

    return response

# =========================================================
# APPLICATION ROUTERS
# =========================================================

app.include_router(dashboard_router)
app.include_router(activities_router)
app.include_router(ai_confidence_router)

app.include_router(risk_intelligence.router)
app.include_router(access_review.router)
app.include_router(access_control.router)
app.include_router(copilot.router)
app.include_router(identities.router)
app.include_router(analytics.router)
app.include_router(settings.router)
app.include_router(roles.router)
app.include_router(privileged_access.router)
app.include_router(permission_drift_router)
app.include_router(auth_router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "company": "IdentityForge AI",
        "product": "AI-IAM Copilot",
        "message": "Forging the Future of Identity Security",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "application": "AI-IAM Copilot",
        "environment": ENVIRONMENT,
        "is_production": IS_PRODUCTION,
        "render_service_name": os.getenv("RENDER_SERVICE_NAME"),
        "render_external_url": os.getenv("RENDER_EXTERNAL_URL"),
        "render_service_id": os.getenv("RENDER_SERVICE_ID"),
    }